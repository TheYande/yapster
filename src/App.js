// src/App.js
import React, { useState, useEffect } from "react";
import { auth, firestore } from "./firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import "./App.css";

const App = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    const q = query(collection(firestore, "messages"), orderBy("createdAt"));
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeMessages();
    };
  }, []);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const signOutUser = () => {
    signOut(auth);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (newMessage.trim() === "") return;

    await addDoc(collection(firestore, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
      uid: user.uid,
      displayName: user.displayName,
    });

    setNewMessage("");
  };

  return (
    <div className="App">
      <header>
        <h1>Chat App</h1>
        {user ? (
          <button onClick={signOutUser}>Sign Out</button>
        ) : (
          <button onClick={signInWithGoogle}>Sign In with Google</button>
        )}
      </header>
      <main>
        {user ? (
          <>
            <div className="messages">
              {messages.map((msg) => (
                <div key={msg.id} className="message">
                  <p>
                    <strong>{msg.displayName}</strong>: {msg.text}
                  </p>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage}>
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <p>Please sign in to chat</p>
        )}
      </main>
    </div>
  );
};

export default App;
