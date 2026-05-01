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

  const sanitizeResponse = (data: any) => {
    // Firebase objects often contain circular references. 
    // We sanitize them for display in the documentation.
    return JSON.parse(JSON.stringify(data, (key, value) => {
      if (key === '_database' || key === 'firestore' || key === 'auth') return undefined;
      return value;
    }));
  };

  const executeRequest = async () => {
    if (!db || !auth) return;
    setLoading(true);
    setResponse(null);

    try {
      // 1. SYSTEM HEALTH
      if (path === '/api/health') {
        setResponse({ 
          status: "healthy", 
          timestamp: new Date().toISOString(), 
          node: "production-01",
          uptime: "99.99%",
          database_connected: !!db 
        });
        setLoading(false);
        return;
      }

      // 2. AUTHENTICATION
      if (path === '/api/login') {
        const body = JSON.parse(bodyInput);
        try {
          const cred = await signInWithEmailAndPassword(auth, body.email, body.password);
          setResponse({ 
            status: "success", 
            message: "Authentication successful",
            user: {
              uid: cred.user.uid,
              email: cred.user.email,
              last_login: cred.user.metadata.lastSignInTime
            }
          });
        } catch (e: any) {
          setResponse({ 
            error: "auth_failed", 
            code: e.code, 
            message: e.message 
          });
        }
        setLoading(false);
        return;
      }

      // 3. FIRESTORE OPERATIONS (USERS)
      const usersRef = collection(db, 'users');

      if (method === 'GET') {
        if (hasParams) {
          if (!paramInput) throw new Error("Document ID required");
          const snap = await getDoc(doc(db, 'users', paramInput));
          if (snap.exists()) {
            setResponse({ id: snap.id, ...snap.data() });
          } else {
            setResponse({ error: "not_found", message: `User ${paramInput} does not exist.` });
          }
        } else {
          const snap = await getDocs(usersRef);
          setResponse(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } 
      else if (method === 'POST') {
        const body = JSON.parse(bodyInput);
        const ref = doc(usersRef);
        const data = { 
          ...body, 
          status: "active",
          createdAt: new Date().toISOString() 
        };
        
        try {
          await setDoc(ref, data);
          setResponse({ 
            status: "created", 
            id: ref.id, 
            data: data 
          });
        } catch (e: any) {
          errorEmitter.emit('permission-error', new FirestorePermissionError({ path: ref.path, operation: 'create', requestResourceData: data }));
          setResponse({ error: "forbidden", code: e.code });
        }
      } 
      else if (method === 'DELETE') {
        if (!paramInput) throw new Error("Document ID required");
        const ref = doc(db, 'users', paramInput);
        try {
          await deleteDoc(ref);
          setResponse({ 
            status: "deleted", 
            id: paramInput,
            message: "User permanently removed from the vault." 
          });
        } catch (e: any) {
          errorEmitter.emit('permission-error', new FirestorePermissionError({ path: ref.path, operation: 'delete' }));
          setResponse({ error: "unauthorized", code: e.code });
        }
      }
    } catch (err: any) {
      setResponse({ 
        error: "request_error", 
        message: err.message || "An unexpected error occurred during execution." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bright-glass border-none overflow-hidden transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
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
          </div>

          <div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">{description}</h4>
            <div className="h-1 w-12 bg-primary/20 rounded-full overflow-hidden">
               <div className="h-full w-4 bg-primary rounded-full"></div>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            {hasParams && (
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document ID</p>
                <Input 
                  value={paramInput}
                  onChange={(e) => setParamInput(e.target.value)}
                  placeholder="e.g. h8a2ksL..."
                  className="bg-slate-50 border-slate-200 h-12 text-sm font-mono text-slate-700 focus:ring-primary focus:bg-white transition-all rounded-xl"
                />
              </div>
            )}

            {(method === 'POST' || path === '/api/login') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Request Payload</p>
                  <Braces className="w-3.5 h-3.5 text-slate-300" />
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
              className="w-full bg-primary text-white hover:bg-primary/90 font-bold uppercase text-[11px] tracking-widest h-14 rounded-xl shadow-lg shadow-primary/20 group"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Execute Real-Time Call <Play className="w-3.5 h-3.5 ml-2 fill-current" /></>}
            </Button>
          </div>
        </div>

        <div className="lg:w-[45%] bg-slate-50/20 p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-slate-400">
              <Terminal className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Live Output</span>
            </div>
            {response && (
              <button onClick={handleCopy} className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-primary">
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>

          <div className="flex-1 min-h-[300px] terminal-scroll overflow-y-auto relative">
            {!response && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30">
                <Terminal className="w-12 h-12 mb-4 text-slate-200" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Ready for Execution</p>
              </div>
            )}
            
            {loading && (
              <div className="space-y-4 pt-2">
                <div className="h-3 w-3/4 bg-slate-200/50 rounded-full animate-pulse"></div>
                <div className="h-3 w-1/2 bg-slate-200/50 rounded-full animate-pulse"></div>
                <div className="h-3 w-2/3 bg-slate-200/50 rounded-full animate-pulse"></div>
              </div>
            )}

            {response && (
              <pre className="text-[13px] font-mono text-primary leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-top-1 duration-300">
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}