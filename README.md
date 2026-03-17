# ☁️ CloudCSS

<p align="center">
  <img src="assets/CloudCSS_logo.svg" alt="CloudCSS Logo" width="500"/>
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=22&pause=1000&color=0EA5E9&center=true&vCenter=true&width=600&lines=Next-gen+Utility-First+CSS;On-demand+CSS+Engine;Blazing+Fast+DX;Zero+Config+Zero+Purge" />
</p>



<p align="center">
  <a href="https://www.npmjs.com/package/@aruvili/cloudcss">
    <img src="https://img.shields.io/npm/v/@aruvili/cloudcss?style=for-the-badge&labelColor=0b1220&color=0EA5E9"/>
  </a>
  <a href="https://www.npmjs.com/package/@aruvili/cloudcss">
    <img src="https://img.shields.io/npm/dt/@aruvili/cloudcss?style=for-the-badge&labelColor=0b1220&color=1388bd"/>
  </a>
  <img src="https://img.shields.io/badge/Zero_Config-Ready-22c55e?style=for-the-badge&labelColor=0b1220"/>
</p>

<p align="center">
  <strong>Build faster. Ship lighter. Style smarter.</strong>
</p>


<!-- INLINE GRADIENT HEADER -->

<p align="center">
  <svg width="100%" height="6" viewBox="0 0 800 6" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1">
        <stop offset="0%" stop-color="#0EA5E9"/>
        <stop offset="50%" stop-color="#22c55e"/>
        <stop offset="100%" stop-color="#6366f1"/>
      </linearGradient>
    </defs>
    <rect width="800" height="6" fill="url(#grad1)" />
  </svg>
</p>


## Why CloudCSS

> Inspired by the original vision of Windi CSS

* No large pre-generated CSS bundles
* No purge step in production
* No configuration overhead
* Generate styles only when used

```diff
- Traditional CSS: Write everything manually
- Tailwind: Pre-generate everything
+ CloudCSS: Generate only what you use
```


<p align="center">
  <svg width="100%" height="6" viewBox="0 0 800 6" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad2">
        <stop offset="0%" stop-color="#6366f1"/>
        <stop offset="50%" stop-color="#0EA5E9"/>
        <stop offset="100%" stop-color="#22c55e"/>
      </linearGradient>
    </defs>
    <rect width="800" height="6" fill="url(#grad2)" />
  </svg>
</p>


## Quick Start

### Installation

```bash
npm install @aruvili/cloudcss -D
```

```bash
pnpm install @aruvili/cloudcss -D
```

```bash
yarn add @aruvili/cloudcss -D
```


### Initialization

```bash
npx cloud --init
```

* Detects framework automatically
* Injects required configuration
* Prepares development environment


### Usage

```html
<div class="p-4 text-blue-500 hover:bg-gray-100">
  Hello CloudCSS
</div>
```


<p align="center">
  <svg width="100%" height="6" viewBox="0 0 800 6" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad3">
        <stop offset="0%" stop-color="#22c55e"/>
        <stop offset="50%" stop-color="#0EA5E9"/>
        <stop offset="100%" stop-color="#6366f1"/>
      </linearGradient>
    </defs>
    <rect width="800" height="6" fill="url(#grad3)" />
  </svg>
</p>


## Features

| Capability        | Description                       |
| ----------------- | --------------------------------- |
| On-demand engine  | Generates only required utilities |
| Instant HMR       | Near-zero latency updates         |
| No purge step     | Automatic production optimization |
| Smart scanning    | HTML and CSS aware parsing        |
| Framework support | Next, Vite, Vue, Svelte           |


## CLI

```bash
npx cloud --init
npx cloud --watch
npx cloud --build
```


## Ecosystem

* Plugin system (in progress)
* Community-driven development

Discussion:
[https://github.com/Aruvili/cloudcss/discussions](https://github.com/Aruvili/cloudcss/discussions)


## Credits

CloudCSS builds on the foundation of Windi CSS.


## License

MIT License
Aruvili / Balapriyan


## Support

<p align="center">
  <a href="https://github.com/Aruvili/cloudcss">
    <img src="https://img.shields.io/badge/Star_Repository-Support_Project-0EA5E9?style=for-the-badge&labelColor=0b1220"/>
  </a>
</p>


