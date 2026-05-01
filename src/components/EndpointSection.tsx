"use client"

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Copy, Check, Terminal, Loader2, Braces, Play } from "lucide-react";
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
        setResponse({ status: "healthy", services: { firestore: "connected", auth: "active" }, timestamp: new Date().toISOString() });
        setLoading(false);
        return;
      }

      if (path === '/api/login') {
        const body = JSON.parse(bodyInput);
        signInWithEmailAndPassword(auth, body.email, body.password)
          .then((cred) => setResponse({ status: "success", uid: cred.user.uid }))
          .catch((e) => setResponse({ status: "error", code: e.code, message: e.message }))
          .finally(() => setLoading(false));
        return;
      }

      const usersRef = collection(db, 'users');

      if (method === 'GET') {
        if (hasParams) {
          if (!paramInput) throw new Error("ID required");
          const snap = await getDoc(doc(db, 'users', paramInput));
          setResponse(snap.exists() ? { id: snap.id, ...snap.data() } : { error: "not_found" });
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
          .then(() => setResponse({ id: ref.id, ...body, created: true }))
          .catch(async (e) => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({ path: ref.path, operation: 'create', requestResourceData: data }));
            setResponse({ status: "forbidden", detail: "security_policy" });
          });
      } 
      else if (method === 'DELETE') {
        if (!paramInput) throw new Error("ID required");
        const ref = doc(db, 'users', paramInput);
        deleteDoc(ref)
          .then(() => setResponse({ status: "deleted", id: paramInput }))
          .catch(async (e) => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({ path: ref.path, operation: 'delete' }));
            setResponse({ status: "forbidden" });
          });
      }
    } catch (err: any) {
      setResponse({ error: "client_error", message: err.message });
    } finally {
      if (path !== '/api/login') setLoading(false);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden shadow-2xl">
      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
        <div className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={cn(
                "font-black tracking-tighter text-[10px] px-2 py-0.5",
                method === 'GET' && "bg-blue-500/10 text-blue-400 border-blue-500/20",
                method === 'POST' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                method === 'DELETE' && "bg-red-500/10 text-red-400 border-red-500/20"
              )}>
                {method}
              </Badge>
              <code className="text-[11px] font-bold text-zinc-500 font-mono tracking-tight">{path}</code>
            </div>
            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Request Builder</div>
          </div>

          <div>
            <h4 className="text-md font-bold text-white mb-2">{description}</h4>
            <div className="h-px w-12 bg-zinc-700"></div>
          </div>

          <div className="space-y-4 pt-4">
            {hasParams && (
              <div className="space-y-1.5">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Document UID</p>
                <Input 
                  value={paramInput}
                  onChange={(e) => setParamInput(e.target.value)}
                  placeholder="e.g. z98aJks29..."
                  className="bg-zinc-950 border-zinc-800 h-10 text-xs font-mono text-zinc-300 focus:ring-1 focus:ring-white transition-all"
                />
              </div>
            )}

            {(method === 'POST' || path === '/api/login') && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Payload</p>
                  <Braces className="w-3 h-3 text-zinc-700" />
                </div>
                <textarea 
                  value={bodyInput}
                  onChange={(e) => setBodyInput(e.target.value)}
                  className="w-full h-32 p-3 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 focus:text-zinc-200 outline-none resize-none transition-colors"
                />
              </div>
            )}

            <Button 
              onClick={executeRequest} 
              disabled={loading}
              className="w-full bg-white text-black hover:bg-zinc-200 font-bold uppercase text-[10px] tracking-widest h-10 rounded-lg"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Play className="w-3.5 h-3.5 mr-2 fill-current" /> Execute Method</>}
            </Button>
          </div>
        </div>

        <div className="lg:w-[45%] bg-zinc-950/50 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-zinc-500">
              <Terminal className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Standard Response</span>
            </div>
            {response && (
              <button onClick={handleCopy} className="p-1 hover:text-white transition-colors text-zinc-600">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          <div className="flex-1 min-h-[220px] terminal-scroll overflow-y-auto relative">
            {!response && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-800">
                <p className="text-[9px] font-black uppercase tracking-[0.2em]">Awaiting Trigger</p>
              </div>
            )}
            
            {loading && (
              <div className="space-y-3 animate-pulse pt-2">
                <div className="h-2 w-3/4 bg-zinc-900 rounded"></div>
                <div className="h-2 w-1/2 bg-zinc-900 rounded"></div>
                <div className="h-2 w-2/3 bg-zinc-900 rounded"></div>
              </div>
            )}

            {response && (
              <pre className="text-[10px] font-mono text-emerald-500/80 leading-relaxed whitespace-pre-wrap">
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}