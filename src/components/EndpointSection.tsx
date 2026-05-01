"use client"

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Send, Copy, Check, Terminal, Code2, AlertCircle, Loader2 } from "lucide-react";
import { useFirestore, useAuth } from '@/firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTest = async () => {
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
          .then((userCredential) => {
            setResponse({ status: "success", session: { uid: userCredential.user.uid, email: userCredential.user.email, expires: "1h" } });
          })
          .catch((e: any) => {
            setResponse({ status: "unauthorized", code: 401, message: e.message });
          })
          .finally(() => setLoading(false));
        return;
      }

      const usersRef = collection(db, 'users');

      if (method === 'GET') {
        if (hasParams) {
          if (!paramInput) throw new Error("Document ID is required.");
          const docRef = doc(db, 'users', paramInput);
          const docSnap = await getDoc(docRef);
          setResponse(docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : { error: "Object not found" });
        } else {
          const snapshot = await getDocs(usersRef);
          setResponse(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } 
      else if (method === 'POST') {
        const body = JSON.parse(bodyInput);
        const newUserRef = doc(usersRef);
        const data = { ...body, createdAt: serverTimestamp() };
        
        setDoc(newUserRef, data)
          .then(() => setResponse({ id: newUserRef.id, ...body, created: true }))
          .catch((error) => {
            const permissionError = new FirestorePermissionError({
              path: newUserRef.path,
              operation: 'create',
              requestResourceData: data
            });
            errorEmitter.emit('permission-error', permissionError);
            setResponse({ error: "Access Denied", context: "Security Rules" });
          });
      } 
      else if (method === 'DELETE') {
        if (!paramInput) throw new Error("ID is required.");
        const docRef = doc(db, 'users', paramInput);
        deleteDoc(docRef)
          .then(() => setResponse({ status: "purged", id: paramInput }))
          .catch((error) => {
            const permissionError = new FirestorePermissionError({ path: docRef.path, operation: 'delete' });
            errorEmitter.emit('permission-error', permissionError);
            setResponse({ error: "Access Denied" });
          });
      }

    } catch (err: any) {
      setResponse({ error: "Malformed Request", message: err.message });
    } finally {
      if (path !== '/api/login') setLoading(false);
    }
  };

  const getMethodStyles = (m: string) => {
    switch (m) {
      case 'GET': return 'bg-sky-500/10 text-sky-600 border-sky-200/50';
      case 'POST': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50';
      case 'DELETE': return 'bg-rose-500/10 text-rose-600 border-rose-200/50';
      default: return 'bg-slate-500/10 text-slate-600';
    }
  };

  return (
    <Card className="group overflow-hidden border border-border/60 hover:border-primary/20 transition-all duration-300">
      <div className="flex flex-col lg:flex-row h-full">
        <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-border/40">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline" className={cn("font-bold px-2.5 py-0.5 rounded-md", getMethodStyles(method))}>
              {method}
            </Badge>
            <code className="text-xs font-code font-bold opacity-70 tracking-tight">{path}</code>
          </div>
          
          <h4 className="text-lg font-bold mb-2">{description}</h4>
          
          <Tabs defaultValue="test" className="mt-8">
            <TabsList className="w-fit bg-muted/40 p-1 h-9 mb-4">
              <TabsTrigger value="info" className="text-xs px-4 h-7">Schema</TabsTrigger>
              <TabsTrigger value="test" className="text-xs px-4 h-7">Playground</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 animate-in fade-in slide-in-from-top-1">
              <div className="rounded-lg bg-muted/30 p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                  <Code2 className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Parameters</span>
                </div>
                {hasParams ? (
                  <p className="text-sm">This endpoint requires a dynamic <code className="text-primary">:id</code> identifier segment.</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No required URL parameters.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="test" className="space-y-4 animate-in fade-in slide-in-from-top-1">
              <div className="space-y-4">
                {hasParams && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Target ID</label>
                    <Input 
                      placeholder="firestore_doc_id" 
                      className="h-9 text-sm font-code"
                      value={paramInput}
                      onChange={(e) => setParamInput(e.target.value)}
                    />
                  </div>
                )}
                
                {method === 'POST' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Request Payload</label>
                    <textarea 
                      className="w-full h-32 p-3 text-xs font-code bg-muted/20 border rounded-md focus:ring-1 focus:ring-primary outline-none resize-none"
                      value={bodyInput}
                      onChange={(e) => setBodyInput(e.target.value)}
                    />
                  </div>
                )}

                <Button onClick={handleTest} disabled={loading} className="w-full h-9 mt-4 shadow-sm">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-3.5 h-3.5 mr-2" /> Send Request</>}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-full lg:w-[45%] bg-slate-950 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Terminal className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">HTTP Response</span>
            </div>
            {response && (
              <button 
                onClick={handleCopy}
                className="text-slate-500 hover:text-slate-200 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
          
          <div className="flex-1 min-h-[200px] json-view relative">
            {!response && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700">
                <div className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center mb-2">
                  <AlertCircle className="w-4 h-4 opacity-30" />
                </div>
                <p className="text-[11px] font-medium italic opacity-40">Awaiting execution...</p>
              </div>
            )}
            
            {loading && (
              <div className="space-y-2 animate-pulse">
                <div className="h-3 w-3/4 bg-slate-800 rounded"></div>
                <div className="h-3 w-1/2 bg-slate-800 rounded"></div>
                <div className="h-3 w-2/3 bg-slate-800 rounded"></div>
              </div>
            )}

            {response && (
              <pre className="text-[11px] font-code text-slate-300 overflow-x-auto selection:bg-white/10 h-full">
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}