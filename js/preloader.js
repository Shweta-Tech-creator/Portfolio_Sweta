/**
 * ============================================================================
 * PRELOADER CONTROLLER: 3D Rolling Ball + Visible Tech Language Bursts
 * Flow:
 * 1. 3D Ball rolls on track (~2.6s)
 * 2. Ball bursts into 10 PROMINENT, READABLE Language Badges (Python, React, C++, AI/ML, etc.)
 * 3. Language Badges float & swoop into "SWETA KADAM"
 * 4. Canvas Pixel particles lock into the name "SWETA KADAM"
 * 5. Tagline reveal & smooth curtain dissolve into Hero
 * ============================================================================
 */

(function () {
	'use strict';

	// DOM Elements
	const preloaderWrapper = document.getElementById('preloader-wrapper');
	const ballContainer = document.querySelector('.ball-loader-container');
	const langBurstContainer = document.getElementById('langBurstContainer');
	const canvasSection = document.querySelector('.canvas-logo-section');
	const canvas = document.getElementById('pixelLogoCanvas');
	const logoDesc = document.querySelector('.logo-desc');
	const skipBtn = document.getElementById('preloaderSkipBtn');

	if (!canvas) return;

	const ctx = canvas.getContext('2d');
	let animationFrameId = null;
	let particles = [];
	let isPreloaderComplete = false;

	// Canvas dimensions & High-DPI support
	let canvasWidth = 860;
	let canvasHeight = 175;
	const dpr = Math.min(window.devicePixelRatio || 1, 2);

	function resizeCanvas() {
		const screenW = window.innerWidth;
		if (screenW < 480) {
			canvasWidth = 360;
			canvasHeight = 110;
		} else if (screenW < 768) {
			canvasWidth = 640;
			canvasHeight = 145;
		} else {
			canvasWidth = 860;
			canvasHeight = 175;
		}

		canvas.width = canvasWidth * dpr;
		canvas.height = canvasHeight * dpr;
		canvas.style.width = `${canvasWidth}px`;
		canvas.style.height = `${canvasHeight}px`;
		ctx.scale(dpr, dpr);
	}

	resizeCanvas();
	window.addEventListener('resize', () => {
		if (!isPreloaderComplete) resizeCanvas();
	});

	// Circular Tech Language Nodes with SVG Logos (Sweta Kadam Tech Stack)
	const techLanguages = [
		{ 
			name: 'Java', 
			class: 'lang-java',
			svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#e76f51" stroke-width="2" stroke-linecap="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>'
		},
		{ 
			name: 'Python', 
			class: 'lang-python',
			svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"><path d="M12 2C6.5 2 6 4.5 6 4.5V7h6v1H4.5S2 8 2 13.5 4.5 19 4.5 19H7v-2.5S7 14 9.5 14h5s2.5 0 2.5-2.5V7S17.5 2 12 2z"></path><circle cx="9" cy="5.5" r="1" fill="#3b82f6"></circle><circle cx="15" cy="18.5" r="1" fill="#3b82f6"></circle></svg>'
		},
		{ 
			name: 'JS', 
			class: 'lang-js',
			svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#ca8a04" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="3"></rect><path d="M9 16v-2c0-.55-.45-1-1-1H7"></path><path d="M14 13.5c.5-.5 1-1 1.5-.5s.5 1 0 1.5-1.5.5-1.5 1.5v.5"></path></svg>'
		},
		{ 
			name: 'C++', 
			class: 'lang-cpp',
			svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round"><path d="M9 8a4.5 4.5 0 1 0 0 8"></path><line x1="14" y1="12" x2="18" y2="12"></line><line x1="16" y1="10" x2="16" y2="14"></line><line x1="19" y1="12" x2="23" y2="12"></line><line x1="21" y1="10" x2="21" y2="14"></line></svg>'
		},
		{ 
			name: 'SQL', 
			class: 'lang-sql',
			svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>'
		},
		{ 
			name: 'React', 
			class: 'lang-react',
			svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="1.8"><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(30 12 12)"></ellipse><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(90 12 12)"></ellipse><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(150 12 12)"></ellipse><circle cx="12" cy="12" r="1.5" fill="#0ea5e9"></circle></svg>'
		},
		{ 
			name: 'Node.js', 
			class: 'lang-node',
			svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon><line x1="12" y1="22" x2="12" y2="15.5"></line><polyline points="22 8.5 12 15.5 2 8.5"></polyline></svg>'
		},
		{ 
			name: 'HTML/CSS', 
			class: 'lang-html',
			svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>'
		},
		{ 
			name: 'Git', 
			class: 'lang-git',
			svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="9" r="3"></circle><path d="M6 9v6"></path><path d="M9 18h3a6 6 0 0 0 6-6V9"></path></svg>'
		},
		{ 
			name: 'MongoDB', 
			class: 'lang-mongo',
			svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M12 2s-5 4.5-5 10c0 4.5 3 8 5 10 2-2 5-5.5 5-10 0-5.5-5-10-5-10z"></path><line x1="12" y1="2" x2="12" y2="22"></line></svg>'
		},
		{ 
			name: 'Docker', 
			class: 'lang-docker',
			svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2"><path d="M2 13h20"></path><path d="M20 13a8 8 0 0 1-16 0"></path><rect x="4" y="9" width="3" height="3"></rect><rect x="9" y="9" width="3" height="3"></rect><rect x="14" y="9" width="3" height="3"></rect><rect x="9" y="5" width="3" height="3"></rect></svg>'
		},
		{ 
			name: 'AWS', 
			class: 'lang-aws',
			svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>'
		}
	];

	/**
	 * Sample target pixel points for "SWETA KADAM" (Crisp, Perfectly Aligned Typography)
	 */
	function getPixelTargets() {
		const offCanvas = document.createElement('canvas');
		const offCtx = offCanvas.getContext('2d');

		offCanvas.width = canvasWidth;
		offCanvas.height = canvasHeight;

		// Calculate large, crisp bold font size
		const fontSize = Math.floor(canvasWidth * 0.115);
		offCtx.fillStyle = '#000000';
		offCtx.font = `900 ${fontSize}px 'Space Grotesk', 'Outfit', sans-serif`;
		offCtx.textAlign = 'center';
		offCtx.textBaseline = 'middle';

		// Render text in offscreen buffer
		offCtx.fillText('SWETA KADAM', canvasWidth / 2, canvasHeight / 2);

		const imgData = offCtx.getImageData(0, 0, canvasWidth, canvasHeight);
		const data = imgData.data;
		const targets = [];
		// Clean integer grid steps (no fractional jitter)
		const step = canvasWidth < 480 ? 4 : 5;
		const dotRadius = (step - 1) / 2;

		for (let y = 0; y < canvasHeight; y += step) {
			for (let x = 0; x < canvasWidth; x += step) {
				const alphaIndex = (y * canvasWidth + x) * 4 + 3;
				if (data[alphaIndex] > 90) {
					targets.push({
						x: x,
						y: y,
						size: step - 1,
						radius: dotRadius,
						alpha: data[alphaIndex] / 255
					});
				}
			}
		}

		return targets;
	}

	/**
	 * Pixel Particle Class with Physics
	 */
	class PixelParticle {
		constructor(originX, originY, targetX, targetY, size, delay) {
			this.x = originX;
			this.y = originY;
			this.targetX = targetX;
			this.targetY = targetY;
			this.size = size;

			// Burst outward slightly then pull towards target
			const angle = Math.random() * Math.PI * 2;
			const speed = 3 + Math.random() * 6;
			this.vx = Math.cos(angle) * speed;
			this.vy = Math.sin(angle) * speed;

			this.friction = 0.90;
			this.spring = 0.055 + Math.random() * 0.03;
			this.delay = delay;
			this.age = 0;
			this.alpha = 0;
			this.color = '#0f172a'; // Clean monochromatic dark charcoal ink
		}

		update() {
			this.age++;
			if (this.age < this.delay) return;

			if (this.age < this.delay + 14) {
				this.x += this.vx;
				this.y += this.vy;
				this.vx *= this.friction;
				this.vy *= this.friction;
				this.alpha = Math.min(1, this.alpha + 0.18);
			} else {
				const dx = this.targetX - this.x;
				const dy = this.targetY - this.y;

				this.vx += dx * this.spring;
				this.vy += dy * this.spring;
				this.vx *= 0.74;
				this.vy *= 0.74;

				this.x += this.vx;
				this.y += this.vy;
				this.alpha = Math.min(1, this.alpha + 0.1);

				if (Math.abs(dx) < 0.6 && Math.abs(dy) < 0.6) {
					this.x = this.targetX;
					this.y = this.targetY;
				}
			}
		}

		draw(context) {
			if (this.age < this.delay || this.alpha <= 0.01) return;

			context.save();
			context.globalAlpha = this.alpha;
			context.fillStyle = this.color;

			// Draw circular particle dot
			const radius = this.size / 2;
			context.beginPath();
			context.arc(
				Math.round(this.x + radius),
				Math.round(this.y + radius),
				radius,
				0,
				Math.PI * 2
			);
			context.fill();

			context.restore();
		}
	}

	/**
	 * Spawn and Animate Language Pills in a Perfect Circle into "SWETA KADAM"
	 */
	function triggerLanguageSequence() {
		if (!langBurstContainer) return;
		langBurstContainer.innerHTML = '';
		gsap.set(langBurstContainer, { rotation: 0 });

		const isMobile = window.innerWidth < 768;
		const isSmallMobile = window.innerWidth < 480;
		// Circle radius (Enlarged circular orbit)
		const radius = isSmallMobile ? 140 : (isMobile ? 190 : 275);
		const total = techLanguages.length;

		// Create DOM pills for each language positioned in a perfect circle with SVG logos
		const pillElements = techLanguages.map((lang, index) => {
			const pill = document.createElement('div');
			pill.className = `flying-lang-pill ${lang.class}`;
			pill.innerHTML = `${lang.svg}<span>${lang.name}</span>`;

			// Calculate circular angle starting from top (-90 degrees)
			const angle = (index / total) * (Math.PI * 2) - (Math.PI / 2);
			const targetX = Math.cos(angle) * radius;
			const targetY = Math.sin(angle) * radius;

			pill.dataset.orbitX = targetX.toFixed(2);
			pill.dataset.orbitY = targetY.toFixed(2);
			langBurstContainer.appendChild(pill);
			return pill;
		});

		// Fade out 3D ball
		if (ballContainer) {
			gsap.to(ballContainer, {
				scale: 0.8,
				opacity: 0,
				duration: 0.4,
				onComplete: () => {
					ballContainer.style.display = 'none';
				}
			});
		}

		const tl = gsap.timeline();

		// 1. Language Pills Burst Outward into a Perfect Circular Ring!
		tl.to(pillElements, {
			x: (i, el) => parseFloat(el.dataset.orbitX),
			y: (i, el) => parseFloat(el.dataset.orbitY),
			scale: 1,
			opacity: 1,
			duration: 0.8,
			ease: 'back.out(1.8)',
			stagger: 0.03
		});

		// 2. Smooth Circular Orbit Rotation (~1.0s)
		tl.to(langBurstContainer, {
			rotation: 35,
			duration: 1.0,
			ease: 'power1.inOut'
		}, '-=0.2');

		// 3. Language Circle Collapses & Swoops Directly into "SWETA KADAM"
		tl.to(pillElements, {
			x: 0,
			y: 0,
			scale: 0.1,
			opacity: 0,
			duration: 0.55,
			ease: 'power4.in',
			stagger: {
				amount: 0.12,
				from: 'center'
			},
			onComplete: () => {
				langBurstContainer.innerHTML = '';
				startCanvasPixelAssembly();
			}
		}, '+=0.1');
	}

	/**
	 * Start Canvas Pixel Particle Assembly
	 */
	function startCanvasPixelAssembly() {
		if (canvasSection) {
			canvasSection.classList.add('active');
		}

		const targets = getPixelTargets();
		particles = [];

		const centerX = canvasWidth / 2;
		const centerY = canvasHeight / 2;

		targets.forEach((target) => {
			const delay = Math.floor(Math.random() * 6);
			particles.push(
				new PixelParticle(
					centerX,
					centerY,
					target.x,
					target.y,
					target.size,
					delay
				)
			);
		});

		let frameCount = 0;
		function renderLoop() {
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			frameCount++;

			let allSettled = true;
			for (let i = 0; i < particles.length; i++) {
				const p = particles[i];
				p.update();
				p.draw(ctx);
				if (Math.abs(p.targetX - p.x) > 0.6 || Math.abs(p.targetY - p.y) > 0.6) {
					allSettled = false;
				}
			}

			// Trigger subtitle reveal
			if (frameCount === 25 && logoDesc) {
				logoDesc.classList.add('revealed');
			}

			// Automatically transition to hero
			if (frameCount > 70 && allSettled && !isPreloaderComplete) {
				setTimeout(finishPreloader, 1300);
			}

			if (!isPreloaderComplete) {
				animationFrameId = requestAnimationFrame(renderLoop);
			}
		}

		renderLoop();
	}

	/**
	 * Finish preloader and trigger Hero entrance animation
	 */
	function finishPreloader() {
		if (isPreloaderComplete) return;
		isPreloaderComplete = true;

		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}

		if (preloaderWrapper) {
			preloaderWrapper.classList.add('preloader-hidden');
			setTimeout(() => {
				if (preloaderWrapper) {
					preloaderWrapper.style.display = 'none';
					preloaderWrapper.style.pointerEvents = 'none';
				}
			}, 850);
		}

		// Trigger entrance animations on the main portfolio page (Thalassic-Style Reveal)
		if (window.gsap) {
			window.gsap.fromTo(
				'.header-nav',
				{ y: -100, opacity: 0, filter: 'blur(12px)' },
				{ y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.95, ease: 'power3.out', delay: 0.1 }
			);

			window.gsap.fromTo(
				'.story-ch1-text',
				{ x: -50, opacity: 0, filter: 'blur(10px)' },
				{
					x: 0,
					opacity: 1,
					filter: 'blur(0px)',
					duration: 1.0,
					ease: 'power3.out',
					delay: 0.2,
					onComplete: () => {
						if (typeof window.triggerKineticTextReveal === 'function') {
							window.triggerKineticTextReveal();
						}
					}
				}
			);

			window.gsap.fromTo(
				'.portrait-sketch-wrapper',
				{ x: 60, opacity: 0, scale: 0.92, filter: 'blur(12px)' },
				{
					x: 0,
					opacity: 1,
					scale: 1.0,
					filter: 'blur(0px)',
					duration: 1.1,
					ease: 'power3.out',
					delay: 0.35,
					onComplete: () => {
						if (typeof window.triggerPhotoSketchAnimation === 'function') {
							window.triggerPhotoSketchAnimation();
						}
					}
				}
			);
		}
	}

	/**
	 * Initialize Preloader Timeline
	 */
	function initPreloader() {
		// 3D ball rolls for ~2.6s, then bursts into visible language badges
		setTimeout(() => {
			triggerLanguageSequence();
		}, 2600);
	}

	// Skip Button Handler
	if (skipBtn) {
		skipBtn.addEventListener('click', () => {
			finishPreloader();
		});
	}

	// Replay Helper
	window.replayPreloader = function () {
		isPreloaderComplete = false;
		if (preloaderWrapper) {
			preloaderWrapper.classList.remove('preloader-hidden');
			preloaderWrapper.style.display = 'flex';
		}
		if (ballContainer) {
			ballContainer.style.display = 'flex';
			ballContainer.style.opacity = '1';
			ballContainer.style.transform = 'scale(1)';
		}
		if (langBurstContainer) {
			langBurstContainer.innerHTML = '';
		}
		if (canvasSection) {
			canvasSection.classList.remove('active');
		}
		if (logoDesc) {
			logoDesc.classList.remove('revealed');
		}
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		initPreloader();
	};

	// Start preloader when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initPreloader);
	} else {
		initPreloader();
	}
})();
