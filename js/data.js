/* ============================================================================
   SITE DATA
   Edit THIS file to update your projects, certifications, or social links.
   You never need to touch index.html or the CSS/JS logic for routine updates —
   just add/remove/edit objects in the arrays below and the page re-renders.
   ============================================================================ */

/* ── Your links ─────────────────────────────────────────────────────────── */
/* Bump RESUME_VERSION (any change — date, number, whatever) every time you
   replace the PDF at assets/resume/. The file's URL otherwise never changes,
   so phones, in-app browsers (LinkedIn's included), and some CDNs keep
   serving the old cached PDF even after you've uploaded a new one — this
   query string forces them to treat it as a new file and fetch it fresh. */
const RESUME_VERSION = "2026-09-01";
const SITE_LINKS = {
  github: "https://github.com/harpreet-03",
  linkedin: "https://www.linkedin.com/in/harpreet16/",
  email: "harpreet162004@gmail.com",
  phone: "+91-7696224407",
  resume: `./assets/resume/Harpreet_Singh_Resume.pdf?v=${RESUME_VERSION}`,
};


/* ── Core skills ───────────────────────────────────────────────────────
   Full skill inventory aligned with the current resume. The Skills
   section (js/main.js → renderSkills()) reads this flat list and sorts
   it into two pieces on its own: an always-visible scrolling ticker of
   foundational languages/tools, and a tabbed grid — AI Concepts, LLM
   Tools & APIs, ML Frameworks, Infrastructure, CS Fundamentals — for
   everything else. Add or remove a skill here and it'll show up in the
   right place automatically; anything renderSkills() doesn't recognize
   yet falls into an auto-generated "Other" tab instead of disappearing,
   so nothing ever gets silently dropped. */
const CORE_SKILLS = [
  "Python", "Java", "SQL",
  "Agentic Workflows", "Agent Design", "Tool Calling", "MCP (Model Context Protocol)",
  "LLMs", "RAG", "NLP", "Machine Learning", "Deep Learning",
  "Prompt Engineering", "A/B Prompt Testing", "Hyperparameter Tuning",
  "OpenAI GPT-3.5/4", "Google Gemini API", "Anthropic Claude API", "n8n", "Ollama",
  "LangChain", "LangGraph", "FastAPI",
  "PyTorch", "TensorFlow", "Scikit-learn",
  "HuggingFace Transformers", "SentenceTransformers", "spaCy", "NumPy", "Pandas", "XGBoost",
  "Firebase", "Docker", "Git", "GitHub", "REST APIs", "Streamlit",
  "PostgreSQL", "ChromaDB",
  "Data Structures & Algorithms", "Operating Systems", "DBMS", "Object-Oriented Programming"
];

/* ── Projects ───────────────────────────────────────────────────────────
   Add a new project any time by copying an object below and editing it.
   Order in this array = display order in the carousel.
   "image" is optional — path to a screenshot/preview. Leave it out and
   the card falls back to the dark tag/number tile.

   Clicking a card opens a glass detail modal. Two more optional fields
   drive that modal:
     - "longDescription" — a fuller write-up shown in the modal. Falls
       back to "description" if omitted, so only add it when you want
       more detail than the card blurb.
     - "video" — path to a self-hosted mp4 (drop the file in
       assets/videos/ and point here, e.g. "./assets/videos/Debrief.mp4").
       When present it replaces the screenshot in the modal, autoplays
       muted and loops, using "image" as the poster frame. Omit it
       and the modal just shows the screenshot large.
     - "demoUrl" — optional link to a *live* hosted demo, separate from
       the GitHub repo. When present it shows a small extra button next
       to "View project". Omit it if the project has no live demo.
   What to actually capture for each project below:
     - Multi-Agent Research Assistant → screenshot of the Streamlit UI
       mid-run, or the final generated report
     - EduVerse AI → screenshot of the chat UI answering a real question
     - Language Identification System → the confusion-matrix heatmap
       from your paper (Figure 2) works great here
     - Energy Efficiency Prediction → a scatter/regression results plot
     - MyBudget → a phone screenshot of the app's main screen
     - Debrief → screenshot once the UI is further along */
const PROJECTS = [
  {
    tag: "Agentic AI",
    icon: "solar:radar-2-linear",
    name: "Multi-Agent Research Assistant",
    subtitle: "Scout → Reader → Writer → Editor",
    stack: ["Python", "LangChain", "Tavily API", "Streamlit"],
    description:
      "Autonomous 4-agent system that automates web research: search, extraction, report generation and review, with real-time retrieval and a structured UI.",
    longDescription:
      "A four-stage LangGraph pipeline — Scout, Reader, Writer, Editor — that turns a topic into a cited, structured research report with no manual steps in between. Scout runs live Tavily searches to find sources, Reader extracts and cleans the relevant content, Writer drafts the report section by section, and Editor reviews it for coherence and citation accuracy before handing back a finished, exportable report through a dark newsroom-style Streamlit UI.",
    video: "./assets/videos/Research-Assistant.mp4",
    link: "https://github.com/harpreet-03/Research-Assistant",
    featured: true,
    image: "./assets/images/Multi_Agent_Research_Assistant.png",
  },
  {
    tag: "Currently building",
    status: "In progress",
    icon: "solar:videocamera-record-linear",
    name: "Debrief",
    subtitle: "AI Video Assistant",
    stack: ["FastAPI", "LLMs", "RAG", "Whisper"],
    description:
      "Multipurpose AI video assistant that transcribes YouTube/meeting recordings, generates summaries, extracts action items, and supports RAG-based chat.",
    link: "https://github.com/harpreet-03/AI-video-assistant",
    image: "./assets/images/Debrief.png",
  },
  {
    tag: "RAG · Backend",
    icon: "solar:square-academic-cap-linear",
    name: "EduVerse AI",
    subtitle: "Agentic University RAG Assistant",
    stack: ["FastAPI", "LangChain", "ChromaDB", "Ollama"],
    description:
      "Modular agentic RAG with hierarchical sub-agent orchestration — 91% retrieval accuracy, sub-800ms latency, zero external API dependencies.",
    link: "https://github.com/harpreet-03/University_Assistant",
    image: "./assets/images/EduVerse_AI.png",
  },
  
  {
    tag: "NLP · Research",
    icon: "solar:translation-linear",
    name: "Language Identification System",
    subtitle: "Multilingual NLP Classifier",
    stack: ["TensorFlow", "CNN", "LSTM", "Naive Bayes"],
    description:
      "17-language classifier at 96.52% accuracy — published at Grenze International Conference, Scopus-indexed.",
    link: "https://github.com/harpreet-03/Language_Identification_System",
    image: "./assets/images/Language_Identification_System.png",
  },
  {
    tag: "Machine Learning",
    icon: "solar:bolt-linear",
    name: "Energy Efficiency Prediction",
    subtitle: "Regression Model for Building Energy Load",
    stack: ["Python", "Scikit-learn", "Pandas", "NumPy"],
    description:
      "ML model predicting heating/cooling load of buildings from architectural parameters, benchmarked across multiple regressors.",
    link: "https://github.com/harpreet-03/Energy_Efficiency_Model",
    image: "./assets/images/Energy_efficiency_pred.png",
  },
  {
    tag: "Android",
    icon: "solar:wallet-money-linear",
    name: "MyBudget",
    subtitle: "Smart Expense Tracker with Voice Input",
    stack: ["Kotlin", "Android", "Room DB", "Speech-to-Text"],
    description:
      "Android app for smart expense tracking, letting users log spending hands-free with voice input.",
    link: "https://github.com/harpreet-03/MyBudget",
    image: "./assets/images/MyBudget.png",
  },
];

/* ── Certifications ─────────────────────────────────────────────────────
   Add a new certificate the same way — copy an object, edit it, and drop
   the PDF into assets/certifications/. "image" here is a real thumbnail
   rendered from each PDF's first page — swap it out any time. */
const CERTIFICATIONS = [
  {
    issuer: "Udemy",
    name: "Agentic AI Bootcamp with LangChain & LangGraph",
    meta: "Aug 2026",
    file: "./assets/certifications/agenticAI-udemy.pdf",
    image: "./assets/certifications/thumbs/image.png",
  },

  {
    issuer: "Amazon · Coursera",
    name: "Generative AI in Software Development",
    meta: "Nov 2025",
    file: "assets/certifications/Generative_AI_in_Software_Development.pdf",
    image: "assets/certifications/thumbs/Generative_AI_thumb.jpg",
  },

  {
    issuer: "Amazon · Coursera",
    name: "Full Stack Web Development",
    meta: "Nov 2025",
    file: "assets/certifications/Full_Stack_Web_Development.pdf",
    image: "assets/certifications/thumbs/Full_Stack_thumb.jpg",
  },

  {
    issuer: "Stanford Online · Coursera",
    name: "Machine Learning Specialization",
    meta: "Andrew Ng · Jul 2024",
    file: "assets/certifications/Machine_Learning_Specialization.pdf",
    image:
      "assets/certifications/thumbs/Machine_Learning_Specialization_thumb.jpg",
  },
  
  
];

/* ── Publication ───────────────────────────────────────────────────────── */
const PUBLICATION = {
  title:
    "Identification of Indian Languages using Naïve Bayes, CNN, LSTM, and HMM",
  venue:
    "Hinweis International Conference on Recent Trends in Engineering and Technology (RTET-2024) · Published in the Grenze International Journal of Engineering and Technology, Scopus-indexed.",
  paperUrl: "https://thegrenze.com/abstract/journal/3887",
  scholarUrl:
    "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=kPnMO-gAAAAJ&citation_for_view=kPnMO-gAAAAJ:u5HHmVD_uO8C",
  pdfFile: "assets/publication/Language_Identification_Paper.pdf",
  certificateImage: "assets/publication/Publication_Certificate.jpeg",
  stack: [
    "Python",
    "TensorFlow",
    "Naive Bayes",
    "CNN",
    "LSTM",
    "HMM",
    "TF-IDF",
    "Scikit-learn",
  ],
};