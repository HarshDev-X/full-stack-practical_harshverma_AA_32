
"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Send, ChevronRight, Clipboard, AlertCircle } from "lucide-react";
import { useFirestore, useAuth } from '@/firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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
  
  const db = useFirestore();
  const auth = useAuth();

  const handleTest = async () => {
    if (!db || !auth) return;
    setLoading(true);
    setResponse(null);

    try {
      // Logic for System Health
      if (path === '/api/health') {
        setResponse({ message: "Server Running", time: new Date().toISOString(), status: "UP" });
        setLoading(false);
        return;
      }

      // Logic for Auth
      if (path === '/api/login') {
        const body = JSON.parse(bodyInput);
        try {
          const userCredential = await signInWithEmailAndPassword(auth, body.email, body.password);
          setResponse({ message: "Login Success", uid: userCredential.user.uid, email: userCredential.user.email });
        } catch (e: any) {
          setResponse({ error: e.message || "Invalid Credentials" });
        }
        setLoading(false);
        return;
      }

      // Logic for Users API
      const usersRef = collection(db, 'users');

      if (method === 'GET') {
        if (hasParams && paramInput) {
          const docRef = doc(db, 'users', paramInput);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setResponse({ message: "Operation successful", data: { id: docSnap.id, ...docSnap.data() } });
          } else {
            setResponse({ error: "User not found" });
          }
        } else {
          const querySnapshot = await getDocs(usersRef);
          const users = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setResponse({ message: "Operation successful", data: users });
        }
      } 
      
      else if (method === 'POST') {
        const body = JSON.parse(bodyInput);
        const newUserRef = doc(usersRef);
        const data = {
          ...body,
          createdAt: serverTimestamp()
        };
        
        setDoc(newUserRef, data)
          .then(() => {
            setResponse({ message: "User created successfully", data: { id: newUserRef.id, ...body } });
          })
          .catch(async (error) => {
            const permissionError = new FirestorePermissionError({
              path: newUserRef.path,
              operation: 'create',
              requestResourceData: data
            });
            errorEmitter.emit('permission-error', permissionError);
            setResponse({ error: "Permission denied" });
          });
      } 
      
      else if (method === 'DELETE') {
        if (!paramInput) {
          setResponse({ error: "ID required for DELETE operation" });
        } else {
          const docRef = doc(db, 'users', paramInput);
          deleteDoc(docRef)
            .then(() => {
              setResponse({ message: "User deleted successfully" });
            })
            .catch(async (error) => {
              const permissionError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'delete'
              });
              errorEmitter.emit('permission-error', permissionError);
              setResponse({ error: "Permission denied" });
            });
        }
      }

    } catch (err: any) {
      setResponse({ error: "Invalid Request Format or Unexpected Error", details: err.message });
    } finally {
      setLoading(false);
    }
  };

  const getMethodColor = (m: string) => {
    switch (m) {
      case 'GET': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'POST': return 'bg-green-100 text-green-700 border-green-200';
      case 'DELETE': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="mb-8 border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="outline" className={`${getMethodColor(method)} font-bold px-3 py-1 rounded`}>
            {method}
          </Badge>
          <code className="text-sm font-code text-accent font-bold">{path}</code>
        </div>
        <CardTitle className="text-xl font-headline">{description}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="test">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
            <TabsTrigger value="info">Documentation</TabsTrigger>
            <TabsTrigger value="test">Test Endpoint</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="p-4 space-y-4 bg-muted/20 rounded-md border mt-2">
            <div>
              <h4 className="text-sm font-semibold mb-2">Endpoint (Simulated)</h4>
              <div className="flex items-center justify-between p-2 bg-background border rounded font-code text-xs">
                <span>{path}</span>
                <Clipboard className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
              </div>
            </div>
            
            {exampleBody && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Request Body (JSON)</h4>
                <pre className="p-3 bg-secondary/30 rounded text-xs font-code overflow-x-auto">
                  {JSON.stringify(exampleBody, null, 2)}
                </pre>
              </div>
            )}
          </TabsContent>

          <TabsContent value="test" className="pt-2 space-y-4">
            <div className="grid gap-4 p-4 border rounded-lg bg-card shadow-inner">
              {hasParams && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">URL Parameters (:id)</label>
                  <Input 
                    placeholder="Enter Firestore Document ID" 
                    value={paramInput}
                    onChange={(e) => setParamInput(e.target.value)}
                  />
                </div>
              )}
              
              {method === 'POST' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Request Body</label>
                  <textarea 
                    className="w-full h-32 p-3 text-xs font-code border rounded-md focus:ring-2 focus:ring-primary outline-none resize-none"
                    value={bodyInput}
                    onChange={(e) => setBodyInput(e.target.value)}
                  />
                </div>
              )}

              {path === '/api/login' && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>Login currently uses Firebase Auth. Ensure an admin user is created in the Firebase console.</p>
                </div>
              )}

              <Button onClick={handleTest} disabled={loading} className="w-full">
                {loading ? "Requesting..." : <><Send className="w-4 h-4 mr-2" /> Execute Request</>}
              </Button>
            </div>

            {response && (
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center">
                  <ChevronRight className="w-4 h-4" /> Response Output (Real-time Firestore)
                </h4>
                <div className="relative">
                  <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs font-code overflow-x-auto border-t-4 border-t-accent shadow-lg max-h-96">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
