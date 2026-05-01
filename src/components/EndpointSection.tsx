"use client"

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Terminal, Loader2, Braces, Play, ArrowRight, XCircle } from "lucide-react";
import { useFirestore, useAuth } from '@/firebase';
import { collection, getDocs, getDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
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
    if (!response) return;
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sanitizeData = (data: any) => {
    // Crucial: Strip Firebase-specific internal logic that causes serialization loops
    return JSON.parse(JSON.stringify(data, (key, value) => {
      if (key.startsWith('_') || key === 'firestore' || key === 'auth' || key === 'proactiveRefresh') return undefined;
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
          node: "production-node-01",
          uptime: "100.00%",
          database_connected: true 
        });
        setLoading(false);
        return;
      }

      // 2. AUTHENTICATION
      if (path === '/api/login') {
        const body = JSON.parse(bodyInput);
        try {
          const cred = await signInWithEmailAndPassword(auth, body.email, body.password);
          setResponse(sanitizeData({ 
            status: "authenticated", 
            message: "Administrative access granted.",
            user: {
              uid: cred.user.uid,
              email: cred.user.email,
              last_sign_in: cred.user.metadata.lastSignInTime
            }
          }));
        } catch (e: any) {
          setResponse({ 
            error: "auth_failed", 
            code: e.code, 
            message: "Invalid credentials or unauthorized access node." 
          });
        }
        setLoading(false);
        return;
      }

      // 3. FIRESTORE OPERATIONS (USERS)
      const usersRef = collection(db, 'users');

      if (method === 'GET') {
        if (hasParams) {
          if (!paramInput) throw new Error("Missing Document ID parameter.");
          const snap = await getDoc(doc(db, 'users', paramInput));
          if (snap.exists()) {
            setResponse(sanitizeData({ id: snap.id, ...snap.data() }));
          } else {
            setResponse({ error: "not_found", message: `Record ${paramInput} not present in cluster.` });
          }
        } else {
          const snap = await getDocs(usersRef);
          const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setResponse(sanitizeData(data));
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
          setResponse(sanitizeData({ 
            status: "provisioned", 
            id: ref.id, 
            data: data 
          }));
        } catch (e: any) {
          errorEmitter.emit('permission-error', new FirestorePermissionError({ path: ref.path, operation: 'create', requestResourceData: data }));
          setResponse({ error: "permission_denied", message: "Security rules blocked record creation." });
        }
      } 
      else if (method === 'DELETE') {
        if (!paramInput) throw new Error("Missing Document ID parameter.");
        const ref = doc(db, 'users', paramInput);
        try {
          await deleteDoc(ref);
          setResponse({ 
            status: "purged", 
            id: paramInput,
            message: "Record permanently removed from storage cluster." 
          });
        } catch (e: any) {
          errorEmitter.emit('permission-error', new FirestorePermissionError({ path: ref.path, operation: 'delete' }));
          setResponse({ error: "unauthorized", message: "Administrative privilege required for deletion." });
        }
      }
    } catch (err: any) {
      setResponse({ 
        error: "runtime_exception", 
        message: err.message || "An unexpected error occurred during execution." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white border-none overflow-hidden transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] rounded-3xl">
      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        <div className="flex-1 p-10 space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className={cn(
                "font-black text-[10px] px-3 py-1 rounded-lg border shadow-sm",
                method === 'GET' && "bg-blue-50 text-blue-600 border-blue-100",
                method === 'POST' && "bg-emerald-50 text-emerald-600 border-emerald-100",
                method === 'DELETE' && "bg-rose-50 text-rose-600 border-rose-100"
              )}>
                {method}
              </Badge>
              <code className="text-xs font-bold text-slate-400 font-mono tracking-tight">{path}</code>
            </div>
          </div>

          <div>
            <h4 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">{description}</h4>
            <div className="h-1.5 w-16 bg-primary/10 rounded-full overflow-hidden">
               <div className="h-full w-6 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="space-y-8 pt-4">
            {hasParams && (
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Document UUID</p>
                <Input 
                  value={paramInput}
                  onChange={(e) => setParamInput(e.target.value)}
                  placeholder="e.g. j7xR20sLQm..."
                  className="bg-slate-50 border-slate-100 h-14 text-sm font-mono text-slate-700 focus:ring-primary focus:bg-white transition-all rounded-2xl"
                />
              </div>
            )}

            {(method === 'POST' || path === '/api/login') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payload Protocol</p>
                  <Braces className="w-3.5 h-3.5 text-slate-300" />
                </div>
                <textarea 
                  value={bodyInput}
                  onChange={(e) => setBodyInput(e.target.value)}
                  className="w-full h-44 p-5 text-sm font-mono bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 focus:bg-white focus:text-slate-900 outline-none resize-none transition-all shadow-inner"
                />
              </div>
            )}

            <Button 
              onClick={executeRequest} 
              disabled={loading}
              className="w-full bg-slate-900 text-white hover:bg-slate-800 font-black uppercase text-[11px] tracking-[0.2em] h-16 rounded-2xl shadow-xl shadow-slate-200 group transition-all active:scale-[0.98]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center gap-3">Dispatch API Call <Play className="w-4 h-4 fill-current" /></span>}
            </Button>
          </div>
        </div>

        <div className="lg:w-[48%] bg-slate-50/40 p-10 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-2.5 text-slate-400">
              <Terminal className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Live Runtime Output</span>
            </div>
            {response && (
              <button onClick={handleCopy} className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-xl transition-all text-slate-400 hover:text-primary hover:scale-105 active:scale-95">
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>

          <div className="flex-1 min-h-[350px] terminal-scroll overflow-y-auto relative z-10">
            {!response && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40">
                <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                  <Terminal className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Listening for signals...</p>
              </div>
            )}
            
            {loading && (
              <div className="space-y-6 pt-2">
                <div className="h-4 w-5/6 bg-slate-200/60 rounded-full animate-pulse"></div>
                <div className="h-4 w-4/6 bg-slate-200/60 rounded-full animate-pulse"></div>
                <div className="h-4 w-3/4 bg-slate-200/60 rounded-full animate-pulse"></div>
              </div>
            )}

            {response && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                {response.error ? (
                  <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex gap-4">
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <pre className="text-[13px] font-mono text-rose-600 leading-relaxed whitespace-pre-wrap">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <pre className="text-[14px] font-mono text-slate-700 leading-relaxed whitespace-pre-wrap bg-white/50 p-6 rounded-2xl border border-white/50 shadow-sm backdrop-blur-sm">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
