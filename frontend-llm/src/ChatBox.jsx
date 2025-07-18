import { useState } from 'react';

export default function ChatBox() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
  const res = await fetch("http://127.0.0.1:8000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: input,
      lesson: "for_loops" // <--- sesuaikan ini dengan folder materi FAISS-mu
    }),
  });

    const data = await res.json();
    setResponse(data.response);
    
    console.log("Respon dari backend:", data); // debug log
    setResponse(data.response);

  };

  return (
    <div>
      <h2>Chat dengan LLM</h2>
      <textarea
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ketik pertanyaanmu di sini..."
      />
      <br />
      <button onClick={handleSend}>Kirim</button>

      <h3>Respons:</h3>
      <pre>{response}</pre>
    </div>
  );
}
