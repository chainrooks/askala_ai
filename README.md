# 🧠 LLM Exercise – Python Tutor Chatbot

This project is an educational chatbot application powered by RAG (Retrieval-Augmented Generation), combining:

* **LLM via Groq (`gemma2-9b-it`)**
* **Embeddings from HuggingFace (`all-MiniLM-L6-v2`)**
* **FastAPI backend** for scalable interaction
* **Streamlit UI** (legacy fallback interface)
* **Markdown lesson files** as the core knowledge base

---

## 🗂 Project Structure

```bash
llm-exercise/
│
├── lessons/                   # Raw markdown lesson files
│   ├── python_variables.md
│   └── ...
│
├── lessons_faiss/             # FAISS indexes generated from lessons
│   ├── python_variables/
│   └── ...
│
├── backend/                   # Backend source files
│   ├── llm_groq.py            # Builds the RAG chain using Langchaing
│   ├── build_faiss_index.py   # Embeds lessons into FAISS vector store
│
├── main.py                    # FastAPI app definition and endpoint
├── legacy_streamlit.py        # Streamlit-based fallback UI
├── .env                       # Environment variables
├── requirements.txt           # Python dependencies
```

---

## ⚙️ How It Works

### 🔹 1. Preprocessing (Vector Indexing)

Markdown lesson files in `lessons/` are embedded into vector representations using `all-MiniLM-L6-v2` via HuggingFace and saved as FAISS indexes:

```bash
python backend/build_faiss_index.py
```

This generates folder-based indexes inside `lessons_faiss/`, one per lesson.

---

### 🔹 2. Backend API (FastAPI)

The backend is powered by **FastAPI** and exposes a single endpoint:

```http
POST /chat
```

It accepts:

```json
{
  "prompt": "Apa itu variabel dalam Python?",
  "lesson": "python_variables"
}
```

It performs the following steps:

1. Uses `lesson` to locate the correct FAISS index
2. Builds a **RAG chain** using:

   * FAISS retriever
   * Custom system prompt
   * `gemma2-9b-it` via Groq
3. Returns a Bahasa Indonesia explanation based on relevant context.

To run:

```bash
uvicorn main:app --reload
```

Default URL: [http://127.0.0.1:8000](http://127.0.0.1:8000)

Explore the Swagger docs at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### 🔹 3. RAG Chain Logic (`llm_groq.py`)

The logic uses Langchain’s `RunnableWithMessageHistory` to:

* Maintain conversational context across sessions
* Retrieve relevant lesson content
* Inject lesson-specific context into a system prompt
* Generate safe, grounded answers using Groq's ChatGroq (Gemma 2 9B-IT)

---

### 🔹 4. Frontend UI (Streamlit)

An optional visual interface is provided via Streamlit:

```bash
streamlit run legacy_streamlit.py
```

The UI supports:

* Lesson material display
* Chat-based Q\&A in parallel
* Step-by-step exploration

---

## 📘 Sample Lesson Files

```bash
lessons/
├── python_variables.md
├── python_list.md
├── if_else.md
├── while.md
├── for_loops.md
└── functions.md
```

---

## 🔐 .env File

Create a `.env` file in the root directory with:

```
GROQ_API_KEY=your_groq_api_key_here
HF_TOKEN=your_huggingface_api_key_here
```

---

## 📦 Python Requirements

All packages are listed in `requirements.txt`. Some important ones:

| Area              | Libraries                                                           |
| ----------------- | ------------------------------------------------------------------- |
| Environment & API | `fastapi`, `uvicorn`, `streamlit`, `python-dotenv`                  |
| RAG Stack         | `langchain`, `langchain-groq`, `langchain-huggingface`, `faiss-cpu` |
| Embeddings        | `sentence-transformers`, `huggingface-hub`, `ollama`                |
| Markdown Parsing  | `unstructured`, `beautifulsoup4`, `markdown`                        |
| Utilities         | `pandas`, `numpy`, `regex`, `tqdm`, `coloredlogs`                   |

---

## ⚠️ Notes

* Ensure consistent use of `all-MiniLM-L6-v2` during both indexing and retrieval.
* The `lesson` name passed to `/chat` must match the FAISS folder name.
* If you want to swap Groq with Ollama (local LLM), you can customize the `llm_groq.py` chain logic.

---