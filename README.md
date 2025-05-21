# Comic Gen

**Visual Storyline Generator powered by AI**

> Comic Gen is an open-source web application that transforms narrative prompts into illustrated comic strips using advanced AI image generation.  
You provide a scene summary and choose a visual style; Comic Gen orchestrates panel-by-panel script interpretation and image creation, then stitches everything together into a seamless comic strip.


## Features

- **Natural Language to Comic:** Enter a story or summary, and watch AI turn it into visual panel scripts.
- **Multiple Art Styles:** Choose from editorial, manga, cyberpunk, and more.
- **Panel-by-Panel AI Generation:** Approve or regenerate each panel, with context-aware prompts for narrative continuity.
- **AI-Driven Image Generation:** Powered by OpenAI's GPT-based image models (`gpt-image-1` or DALL-E 3 ready).
- **Full Strip Stitching:** Automatically combines panels into a single image.
- **Modern UI:** Built with Next.js 15, React 19, TailwindCSS, and TypeScript.

---

## API Access
Copy the `.env.example` to the same directory as `.env.local` and place your API Key as 'OPENAI_API_KEY=sk-proj...'
Note - your platform organisation might need to be verified in order to use the gpt-image-1 model via the API

## Architecture

comic-gen  
    ├── app  
    │    ├── api  
    │    │    ├── generate-image  
    │    │    │    └── route.ts  
    │    │    ├── interpret-image  
    │    │    │    └── route.ts  
    │    │    └── stitch-panels  
    │    │         └── route.ts  
    │    ├── favicon.ico  
    │    ├── globals.css  
    │    ├── layout.tsx  
    │    └── page.tsx  
    ├── components  
    │    ├── PanelEditor.tsx  
    │    ├── PanelLayout.tsx  
    │    └── StoryPanel.tsx  
    ├── lib  
    │    └── openai.ts  
    ├── .env.example   
    ├── .gitignore  
    ├── eslint.config.mjs  
    ├── next.config.ts  
    ├── next-env.d.ts  
    ├── package.json  
    ├── package-lock.json  
    ├── postcss.config.mjs  
    ├── README.md  
---

## Getting Started

### 1. **Clone and Install**

```bash
git clone https://github.com/your-username/comic-gen.git
cd comic-gen
npm install
npm run dev
```

##  Usage
Enter a story summary:
Provide 2–6 sentences describing the scene or sequence.

## Choose a visual style:
Select your preferred art style from the dropdown.

## Generate Panels:
Approve, regenerate, or refine each panel’s visual/caption as the script advances.

## Stitch & Download:
Once all panels are accepted, stitch the strip and download the final image.

## Configuration
All model and rendering options are easily adjustable in code:

Supported models: gpt-image-1 (default, OpenAI)

Styles, sizes, and quality: set in components/StoryPanel.tsx and PanelEditor.tsx

Image output format: JPEG/PNG, configurable per panel

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

To contribute:

Fork the repo

Create your feature branch (git checkout -b feature/your-feature)

Commit your changes (git commit -am 'Add awesome feature')

Push to the branch (git push origin feature/your-feature)

Open a pull request

# License
This project is licensed under the MIT License. See LICENSE for details.

## Acknowledgements
OpenAI for the API and models powering image generation.

Next.js and Vercel for the app framework.

All contributors & the open-source community.

