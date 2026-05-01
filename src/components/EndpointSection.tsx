"use client"

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Terminal, Loader2, Braces, Play, ArrowRight } from "lucide-react";
import { useFirestore, useAuth } from '@/firebase';
import { collection, getDocs, getDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { cn } from '@/lib/utils';

interface EndpointSectionProps {
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
  description: string;
  exampleBody?: any;
  hasParams?: boolean;
}

export function EndpointSection({ method, path, description, exampleBody, hasParams }: EndpointSectionProps) {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [bodyInput, setBodyInput] = useState(JSON.stringify(exampleBody || {}, null, 2));
  const [paramInput, setParamInput] = useState('');
  const [copied, setCopied] = useState(false);
  
  const db = useFirestore();
  const auth = useAuth();

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeRequest = async () => {
    if (!db || !auth) return;
    setLoading(true);
    setResponse(null);

    try {
      if (path === '/api/health') {
        setResponse({ status: "healthy", timestamp: new Date().toISOString(), node: "us-east-1" });
        setLoading(false);
        return;
      }

      if (path === '/api/login') {
        const body = JSON.parse(bodyInput);
        signInWithEmailAndPassword(auth, body.email, body.password)
          .then((cred) => setResponse({ status: "success", session_id: cred.user.uid }))
          .catch((e) => setResponse({ error: e.code, detail: e.message }))
          .finally(() => setLoading(false));
        return;
      }

      const usersRef = collection(db, 'users');

      if (method === 'GET') {
        if (hasParams) {
          if (!paramInput) throw new Error("Missing ID");
          const snap = await getDoc(doc(db, 'users', paramInput));
          setResponse(snap.exists() ? { id: snap.id, ...snap.data() } : { error: "document_not_found" });
        } else {
          const snap = await getDocs(usersRef);
          setResponse(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } 
      else if (method === 'POST') {
        const body = JSON.parse(bodyInput);
        const ref = doc(usersRef);
        const data = { ...body, createdAt: serverTimestamp() };
        setDoc(ref, data)
          .then(() => setResponse({ id: ref.id, ...body, status: "provisioned" }))
          .catch(async (e) => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({ path: ref.path, operation: 'create', requestResourceData: data }));
            setResponse({ error: "permission_denied" });
          });
      } 
      else if (method === 'DELETE') {
        if (!paramInput) throw new Error("Missing ID");
        const ref = doc(db, 'users', paramInput);
        deleteDoc(ref)
          .then(() => setResponse({ status: "deleted", ref: paramInput }))
          .catch(async (e) => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({ path: ref.path, operation: 'delete' }));
            setResponse({ error: "unauthorized" });
          });
      }
    } catch (err: any) {
      setResponse({ error: "runtime_exception", message: err.message });
    } finally {
      if (path !== '/api/login') setLoading(false);
    }
  };

  return (
    <Card className="bright-glass border-none overflow-hidden transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        <div className="flex-1 p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className={cn(
                "font-black text-[11px] px-3 py-1 rounded-lg",
                method === 'GET' && "bg-blue-100 text-blue-600 border-blue-200",
                method === 'POST' && "bg-emerald-100 text-emerald-600 border-emerald-200",
                method === 'DELETE' && "bg-rose-100 text-rose-600 border-rose-200"
              )}>
                {method}
              </Badge>
              <code className="text-sm font-bold text-slate-400 font-mono tracking-tight">{path}</code>
            </div>
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Builder</div>
          </div>

          <div>
            <h4 className="text-xl font-black text-slate-800 mb-2">{description}</h4>
            <div className="h-1 w-10 bg-primary rounded-full"></div>
          </div>

          <div className="space-y-6 pt-4">
            {hasParams && (
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document ID</p>
                <Input 
                  value={paramInput}
                  onChange={(e) => setParamInput(e.target.value)}
                  placeholder="e.g. jS92kkLa..."
                  className="bg-slate-50 border-slate-200 h-12 text-sm font-mono text-slate-700 focus:ring-primary focus:bg-white transition-all rounded-xl"
                />
              </div>
            )}

            {(method === 'POST' || path === '/api/login') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payload</p>
                  <Braces className="w-3.5 h-3.5 text-slate-200" />
                </div>
                <textarea 
                  value={bodyInput}
                  onChange={(e) => setBodyInput(e.target.value)}
                  className="w-full h-36 p-4 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-600 focus:bg-white focus:text-slate-900 outline-none resize-none transition-all"
                />
              </div>
            )}

            <Button 
              onClick={executeRequest} 
              disabled={loading}
              className="w-full bg-primary text-white hover:bg-primary/90 font-black uppercase text-[11px] tracking-widest h-14 rounded-xl shadow-lg shadow-primary/20 group"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Execute Request <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" /></>}
            </Button>
          </div>
        </div>

        <div className="lg:w-[45%] bg-slate-50/30 p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-slate-400">
              <Terminal className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Runtime Output</span>
            </div>
            {response && (
              <button onClick={handleCopy} className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-primary">
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>

          <div className="flex-1 min-h-[300px] terminal-scroll overflow-y-auto relative">
            {!response && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
                <Terminal className="w-12 h-12 mb-4 text-slate-300" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Awaiting Signal</p>
              </div>
            )}
            
            {loading && (
              <div className="space-y-4 pt-2">
                <div className="h-3 w-3/4 bg-slate-200 rounded-full animate-pulse"></div>
                <div className="h-3 w-1/2 bg-slate-200 rounded-full animate-pulse"></div>
                <div className="h-3 w-2/3 bg-slate-200 rounded-full animate-pulse"></div>
              </div>
            )}

            {response && (
              <pre className="text-sm font-mono text-primary leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-top-2 duration-300">
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}