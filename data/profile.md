# Anil Suthar S

<!--
  Single source of truth about Anil. The website (lib/profile.ts) parses this
  file and the AI twin (lib/prompt.ts) reads it as its only knowledge.
  Format rules (see .claude/skills/update-profile/SKILL.md):
    - "## Section" headings are fixed: About, Contact, Skills, Projects, Education, Experience.
    - "### Item" headings start an entry inside Skills / Projects / Education / Experience.
    - "- Key: Value" bullets are structured fields; any other paragraph text is the description.
  HTML comments (like this one) are stripped before the twin sees the file.
-->

## About

- Tagline: B.Tech Digital Transformation student building full-stack web apps and ML pipelines
- Location: Bangalore, Karnataka, India

I'm a third-year B.Tech student in Digital Transformation at Atria University, interested in both software development and machine learning. I've worked on full-stack web apps using Node.js and MongoDB, and built ML pipelines using ensemble methods like XGBoost and Random Forest. I enjoy working on problems that sit at the intersection of data and real usability, and I'm looking for an internship where I can contribute meaningfully and keep learning.

## Contact

- Email: anil.sutharr0@gmail.com
- GitHub: https://github.com/anilsuthars31
- LinkedIn: https://www.linkedin.com/in/anilsuthar-s

<!-- TODO(Anil): optional extras (files go in public/):
- Photo: /photo.jpg
- Resume: /resume.pdf
-->

## Skills

### Languages

- Items: Python, JavaScript, TypeScript, SQL

### Web Technologies

- Items: HTML5, CSS3, React.js, Node.js, Express.js, Next.js, Tailwind CSS, REST APIs

### Databases

- Items: MySQL, MongoDB

### ML & Data

- Items: Supervised & Unsupervised Learning, XGBoost, Random Forest, AdaBoost, SMOTE, Isolation Forest, K-Means, Feature Engineering, pandas, scikit-learn, matplotlib

### Tools

- Items: Git, GitHub, VS Code, Figma, Claude Code, Wireshark

### Concepts

- Items: REST APIs, OOP, CRUD, Auth & Authorization, Responsive Design, Relational DB Design

## Projects

### Portfolio + AI Digital Twin

- Category: AI
- Tech: Next.js, TypeScript, Tailwind CSS, Gemini API, Claude API
- Highlights: Streaming chatbot · grounded answers · Claude Code hooks
- GitHub: https://github.com/anilsuthars31/portfolio-ai-digital-twin

This website. It includes an AI chatbot that answers questions about me in my own voice, grounded only in a profile file so it never invents facts. It runs on the free Gemini API and can switch to the Claude API. I built it with Claude Code using custom skills, slash commands, and hooks.

### Pokételligence — ML Pipeline for Gaming Data

- Category: Machine Learning
- Tech: Python, scikit-learn, XGBoost, Random Forest, AdaBoost, SMOTE
- Highlights: F1 0.957 · Test R² 0.682 · 1.000 minority-class recall

I engineered new features like total base stats and attack-defense ratios with FunctionTransformer, keeping transformations inside the pipeline to avoid data leakage. I tuned an XGBoost regression model to predict capture rates (test R² of 0.682) and built a stacked classifier (XGBoost + Random Forest + AdaBoost) for legendary status detection with an F1 score of 0.957. I handled heavy class imbalance with SMOTE and class-weight tuning, reaching 1.000 recall on the minority class.

### MinorMap — Academic Decision Support System

- Category: Full-Stack
- Tech: Node.js, Express.js, MongoDB, REST APIs
- Highlights: Team project · full backend · role-based access · MongoDB schema design
- GitHub: https://github.com/ibrahimarshath/MinorMap-

A quiz-based system that helps students pick academic minors. I built the full backend: RESTful APIs for user authentication, quiz management, and result processing; role-based access (admin vs student) with middleware; and MongoDB schemas designed around the app's data flow. I also wired the frontend to the backend so the quiz-to-result experience felt smooth end to end.

### Faculty Research Showcase Platform

- Category: Full-Stack
- Tech: Web development, Responsive design, Role-based access
- Highlights: Team project · responsive UI · role-based access

A web platform where faculty can add, edit, and display their research publications and profiles. I made the UI responsive across devices and set up role-based access for different user types. It was a team project: I took part in requirement discussions, planned the UI with the team, and we split the feature work.

### Visit Rajasthan — 3D Travel Guide

- Category: Web
- Tech: TypeScript, Vite, Three.js, Blender, GitHub Actions
- Highlights: Team project · WebGL landing scene · live on GitHub Pages
- GitHub: https://github.com/Janci-Kundana/visit-rajasthan
- Live: https://janci-kundana.github.io/visit-rajasthan/

A team-built visual travel guide to four Rajasthan destinations (Jaisalmer, Jaipur, Udaipur and Jawai Bandh), with a 3D Hawa Mahal landing scene, isometric city tiles rendered in Blender, and a guide page with an embedded map for each place. My contribution was formalising the project's SPEC.md and CLAUDE.md into the product contract that every change to the site has to follow.

### Atria in Borderland — Zombie Card Game

- Category: Game
- Tech: Python, OOP, UML
- Highlights: Team project · 5-player rounds · object-oriented design with UML
- GitHub: https://github.com/ibrahimarshath/Atria-in-boderland-CLI-based-game-

A command-line card game inspired by Alice in Borderland, built as a team with classmates. Five players compete over five rounds with number cards and special Zombie, Shotgun and Vaccine cards: zombies infect the humans they beat, and the side with the most players after five rounds wins. The code is object-oriented (abstract card classes, players, match resolver) and designed from a UML diagram, and I worked on the final presentation.

### Beat Tap — Rhythm Game

- Category: Game
- Tech: Python, Pygame
- Highlights: 4 lanes · streak & star scoring · unlockable songs
- GitHub: https://github.com/anilsuthars31/Beat_tap

A 4-lane rhythm game: notes fall down four tracks and you press D, F, J or K the moment each note reaches the hit-line. It has a song dashboard, streak and star scoring, and unlockable songs as you earn points.

### Wikki Peek — Visual Dictionary

- Category: Web
- Tech: HTML, CSS, JavaScript, Wikipedia REST API, Web Speech API
- Highlights: Live Wikipedia lookups · text-to-speech · dark & colorblind modes
- GitHub: https://github.com/anilsuthars31/programming_the_web

My final project for the Programming the Web course: search any word and it fetches a summary and image from the Wikipedia REST API, reads the definition aloud with text-to-speech, and offers dark and colorblind-friendly themes. I also analysed its network traffic to the Wikipedia API with Wireshark. The same repo holds my other coursework from the course: a country explorer using the CountriesNow API, CSS layout challenges, and JavaScript practice.

### Foundations of Backend Development

- Category: Backend
- Tech: JavaScript, Node.js
- Highlights: Node.js fundamentals · file I/O · event emitters
- GitHub: https://github.com/anilsuthars31/Foundations_of_Backend_Development

Day-by-day exercises from my backend development sprint, covering server-side JavaScript fundamentals with Node.js, such as reading JSON data with the fs module and event-driven code with EventEmitter.

## Education

### B.Tech in Digital Transformation — Atria University

- Period: Third year · graduating 2028
- Location: Bangalore, India

CGPA: 8.1. Relevant coursework includes Database Management Systems, Web Development, Machine Learning (Supervised & Unsupervised), Data Structures & Algorithms (Introductory), Critical Thinking in the Age of AI, Backend & Full-Stack Development, Digital Systems Design, and AI-Augmented Software Engineering.

## Experience

### Teaching Assistant, Introduction to Programming (Python) — Atria University

- Location: Bangalore, India

I helped first-year students get comfortable with Python basics and work through bugs in their code. I ran lab sessions and spent time with students one-on-one when they got stuck.
