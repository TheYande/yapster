// src/App.js
import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { auth, firestore } from "./firebase";
import "./App.css";

const App = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    firestore
      .collection("messages")
      .orderBy("createdAt")
      .onSnapshot((snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
      });
  }, []);

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  const signOut = () => {
    auth.signOut();
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (newMessage.trim() === "") return;

    await firestore.collection("messages").add({
      text: newMessage,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
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
          <button onClick={signOut}>Sign Out</button>
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
