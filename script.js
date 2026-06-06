const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function setActiveFilterButton(activeButton) {
	$$('.filter-btn').forEach((button) => {
		button.classList.toggle('is-active', button === activeButton);
		button.setAttribute('aria-selected', button === activeButton ? 'true' : 'false');
		button.setAttribute('tabindex', button === activeButton ? '0' : '-1');
	});
}

function applyProjectFilter(filter) {
	const projects = $$('.project-card');
	projects.forEach((card) => {
		const category = (card.dataset.category || '').toLowerCase();
		const shouldShow = filter === 'all' || category === filter;
		card.dataset.filtered = shouldShow ? 'true' : 'false';
	});
}

function initProjectFilters() {
	const buttons = $$('.filter-btn');
	if (buttons.length === 0) return;

	buttons.forEach((button) => {
		button.addEventListener('click', () => {
			const filter = (button.dataset.filter || 'all').toLowerCase();
			setActiveFilterButton(button);
			applyProjectFilter(filter);
			if (typeof window.__syncProjectPagination === 'function') {
				window.__syncProjectPagination(filter);
			}
		});
	});

	const active = $('.filter-btn.is-active') || buttons[0];
	setActiveFilterButton(active);
	const activeFilter = (active.dataset.filter || 'all').toLowerCase();
	applyProjectFilter(activeFilter);
	if (typeof window.__syncProjectPagination === 'function') {
		window.__syncProjectPagination(activeFilter);
	}
}

function initProjectPagination() {
	const pagination = $('.project-pagination');
	const prevButton = $('.project-page-prev');
	const nextButton = $('.project-page-next');
	const status = $('.project-page-status');
	const projectsSection = $('#projects');
	const itemsPerPage = 3;

	if (!pagination || !prevButton || !nextButton || !status) return;

	let currentPage = 0;
	let currentFilter = 'all';

	const scrollToProjectsTop = () => {
		if (!projectsSection) return;
		projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	const getMatchingCards = () =>
		$$('.project-card').filter((card) => (card.dataset.filtered || 'true') !== 'false');

	const getTotalPages = (cards) => Math.max(1, Math.ceil(cards.length / itemsPerPage));

	const render = () => {
		const matchingCards = getMatchingCards();
		const totalPages = getTotalPages(matchingCards);
		currentPage = Math.min(currentPage, totalPages - 1);

		$$('.project-card').forEach((card) => {
			card.classList.remove('is-page-entering');
			const isMatch = (card.dataset.filtered || 'true') !== 'false';
			const index = matchingCards.indexOf(card);
			const shouldShow = isMatch && index >= currentPage * itemsPerPage && index < (currentPage + 1) * itemsPerPage;
			card.style.display = shouldShow ? '' : 'none';
			if (shouldShow) {
				void card.offsetWidth;
				card.classList.add('is-page-entering');
			}
		});

		const showControls = matchingCards.length > itemsPerPage;
		pagination.style.display = showControls ? 'flex' : 'none';
		status.textContent = `${currentPage + 1} of ${totalPages}`;
		prevButton.disabled = !showControls || currentPage === 0;
		nextButton.disabled = !showControls || currentPage >= totalPages - 1;
	};

	window.__syncProjectPagination = (filter) => {
		currentFilter = filter;
		currentPage = 0;
		applyProjectFilter(currentFilter);
		render();
	};

	prevButton.addEventListener('click', () => {
		if (currentPage === 0) return;
		currentPage -= 1;
		render();
		scrollToProjectsTop();
	});

	nextButton.addEventListener('click', () => {
		const totalPages = getTotalPages(getMatchingCards());
		if (currentPage >= totalPages - 1) return;
		currentPage += 1;
		render();
		scrollToProjectsTop();
	});

	render();
	window.__syncProjectPagination(currentFilter);
}

function initFooterYear() {
	const yearEl = $('#year');
	if (!yearEl) return;
	yearEl.textContent = String(new Date().getFullYear());
}

function setModalOpen(modalEl, isOpen) {
	if (!modalEl) return;
	modalEl.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
	document.body.classList.toggle('modal-open', isOpen);
}

function initProjectDemoFlow() {
	const chooserModal = $('#projectDemoModal');
	const videoModal = $('#projectVideoModal');
	const demoTriggers = $$('[data-project-demo-trigger]');
	if (!chooserModal || !videoModal || demoTriggers.length === 0) return;

	const projectConfigs = {
		tbisita: {
			label: 'TBisita',
			description: 'Download the APK or watch the video demo.',
				websiteUrl: 'https://drive.google.com/drive/folders/1jP0bVMpILrdv1thrcF0iEJLJVM6qPdSv?usp=sharing',
				primaryActionLabel: 'Download APK',
				primaryActionMode: 'link',
			videos: [
				{ title: 'Guest Video Demo', source: 'https://youtu.be/xHcr-urN1Os' },
				{ title: 'Patient Video Demo', source: 'https://youtu.be/0-NsbAzIIws' },
				{ title: 'Doctor Video Demo', source: 'https://youtu.be/cAgU9BTVmdc' },
				{ title: 'Healthworker Video Demo', source: 'https://youtu.be/zz-dWsCqrgw' },
				{ title: 'Super Admin & TB Coordinator Video Demo', source: 'https://youtu.be/Y8DvpyAW4f4' },
			],
		},
		reqease: {
			label: 'ReqEase',
			description: 'Open the live website or watch the video demo.',
			websiteUrl: 'https://reqease.netlify.app/',
			primaryActionLabel: 'Website',
			primaryActionMode: 'link',
			videos: [
				{ title: 'ReqEase Video Demo', source: 'https://youtu.be/tsLiwciMZ80' },
				{ title: 'FastAPI Testing', source: 'https://youtu.be/yo5fgqoXIP8' },
				{ title: 'Cypress Testing', source: 'https://youtu.be/4jsWEI0dbvE' },
			],
		},
		jrs: {
			label: 'JRS Essentials',
			description: 'Open the live website or watch the video demo.',
			websiteUrl: 'https://jrs-essentials.vercel.app/',
			primaryActionLabel: 'Website',
			primaryActionMode: 'link',
			videos: [{ title: 'JRS Essentials Video Demo', source: 'https://youtu.be/hwn1gqj0hTU' }],
		},
		jcb: {
			label: 'J.C.B',
			description: 'Download the APK or watch the video demo.',
			websiteUrl: 'https://drive.google.com/drive/folders/1a038trarpWKwTtGzMx2YEpuUX2_6yBML?usp=sharing',
			primaryActionLabel: 'Download APK',
			primaryActionMode: 'link',
			videos: [{ title: 'JCB Video Demo', source: 'https://youtu.be/6mvGnX-cwlA' }],
		},
		mediguide: {
			label: 'MediGuide',
			description: 'Open the figma or watch the video demo.',
			websiteUrl:
				'https://www.figma.com/design/xniDa09wRvLZMAQqkOufVU/MediGuide?node-id=0-1&t=wde4NNGyb9wxGFMb-1',
			primaryActionLabel: 'Figma',
			primaryActionMode: 'link',
			videos: [{ title: 'MediGuide Video Demo', source: 'https://youtu.be/NNFfSbbP-yU' }],
		},
		hrams: {
			label: 'HRAMS',
			description: 'Open the live website or watch the video demo.',
			websiteUrl: 'https://jrs-essentials.vercel.app/',
			primaryActionLabel: 'Website',
			primaryActionMode: 'link',
			videos: [{ title: 'HRAMS Video Demo', source: 'https://youtu.be/P4mqvsfZRzI' }],
		},
	};

	const chooserCloseEls = $$('[data-project-demo-close]', chooserModal);
	const videoCloseEls = $$('[data-project-video-close]', videoModal);
	const openVideoButton = $('[data-open-project-video]', chooserModal);
	const chooserLabelEl = $('.project-demo-label', chooserModal);
	const chooserTitleEl = $('.project-demo-title', chooserModal);
	const chooserTextEl = $('.project-demo-text', chooserModal);
	const websiteButtonEl = $('.project-demo-link-website', chooserModal);
	const videoListEl = $('#projectVideoList', videoModal);
	const videoPlayerContainer = videoModal.querySelector('.project-video-player');
	const videoCloseButton = videoModal.querySelector('.modal-close');

	let activeProjectKey = 'jrs';
	let activeVideoIndex = 0;
	let currentPlayerKind = 'video'; // 'video' or 'iframe'

	const getActiveConfig = () => projectConfigs[activeProjectKey] || projectConfigs.jrs;

	const closeModal = (modal) => {
		setModalOpen(modal, false);
		const opener = modal.__opener;
		if (opener && typeof opener.focus === 'function') opener.focus();
	};

	const isYouTubeUrl = (src) => typeof src === 'string' && (src.includes('youtu.be') || src.includes('youtube.com'));
	const extractYouTubeId = (src) => {
		try {
			if (src.includes('youtu.be/')) return src.split('youtu.be/')[1].split(/[?&]/)[0];
			const url = new URL(src);
			return url.searchParams.get('v') || '';
		} catch (e) {
			return '';
		}
	};

	const stopPlayback = () => {
		if (!videoPlayerContainer) return;
		if (currentPlayerKind === 'video') {
			const vid = videoPlayerContainer.querySelector('video');
			if (vid && typeof vid.pause === 'function') {
				vid.pause();
				vid.removeAttribute('src');
				vid.load && vid.load();
			}
		} else if (currentPlayerKind === 'iframe') {
			const iframe = videoPlayerContainer.querySelector('iframe');
			if (iframe) iframe.src = '';
		}
		currentPlayerKind = 'video';
		// reset container to default video element so next non-iframe can reuse markup
		if (videoPlayerContainer && !videoPlayerContainer.querySelector('video')) {
			videoPlayerContainer.innerHTML = '<video id="projectVideoPlayer" controls playsinline preload="metadata"></video>';
		}
	};

	const renderActiveVideo = (index) => {
		const videos = getActiveConfig().videos;
		const video = videos[index];
		if (!videoPlayerContainer || !video) return;
		// stop any existing playback first
		stopPlayback();
		if (isYouTubeUrl(video.source)) {
			const id = extractYouTubeId(video.source);
			const embed = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
			videoPlayerContainer.innerHTML = `<iframe id="projectVideoIframe" src="${embed}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
			currentPlayerKind = 'iframe';
		} else {
			videoPlayerContainer.innerHTML = `<video id="projectVideoPlayer" controls playsinline preload="metadata" src="${video.source}"></video>`;
			currentPlayerKind = 'video';
		}
		$$('[data-video-index]', videoModal).forEach((button) => {
			button.classList.toggle('is-active', Number(button.dataset.videoIndex || '-1') === index);
		});
	};

	const buildVideoList = () => {
		if (!videoListEl) return;
		const videos = getActiveConfig().videos;
		videoListEl.innerHTML = '';
		videos.forEach((video, index) => {
			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'project-video-item';
			button.dataset.videoIndex = String(index);
			button.innerHTML = `<span>${video.title}</span><span class="project-video-meta">Play</span>`;
			button.addEventListener('click', () => {
				activeVideoIndex = index;
				renderActiveVideo(index);
				if (currentPlayerKind === 'video') {
					const vid = videoPlayerContainer.querySelector('video');
					if (vid && typeof vid.play === 'function') vid.play().catch(() => {});
				}
			});
			videoListEl.appendChild(button);
		});
		renderActiveVideo(activeVideoIndex);
	};

	const openVideoModal = () => {
		setModalOpen(chooserModal, false);
		setModalOpen(videoModal, true);
		videoModal.__opener = chooserModal.__opener || openVideoButton;
		buildVideoList();
		if (videoCloseButton && typeof videoCloseButton.focus === 'function') videoCloseButton.focus();
		if (currentPlayerKind === 'video') {
			const vid = videoPlayerContainer.querySelector('video');
			if (vid && typeof vid.play === 'function') vid.play().catch(() => {});
		}
	};

	const openVideoModalDirectly = (opener) => {
		videoModal.__opener = opener;
		setModalOpen(videoModal, true);
		buildVideoList();
		if (videoCloseButton && typeof videoCloseButton.focus === 'function') videoCloseButton.focus();
		if (currentPlayerKind === 'video') {
			const vid = videoPlayerContainer.querySelector('video');
			if (vid && typeof vid.play === 'function') vid.play().catch(() => {});
		}
	};

	const openChooserModal = (opener) => {
		chooserModal.__opener = opener;
		const triggerKey = (opener && opener.dataset && opener.dataset.projectDemoTrigger) || 'jrs';
		activeProjectKey = projectConfigs[triggerKey] ? triggerKey : 'jrs';
		activeVideoIndex = 0;
		const config = getActiveConfig();
		if (chooserLabelEl) chooserLabelEl.textContent = config.label;
		if (chooserTitleEl) chooserTitleEl.textContent = 'Choose a demo';
		if (chooserTextEl) chooserTextEl.textContent = config.description;
		if (websiteButtonEl) {
			websiteButtonEl.textContent = config.primaryActionLabel || 'Website';
			websiteButtonEl.href = config.websiteUrl;
			if ((config.primaryActionMode || 'link') === 'download') {
				websiteButtonEl.setAttribute('download', config.primaryActionDownload || '');
				websiteButtonEl.removeAttribute('target');
				websiteButtonEl.removeAttribute('rel');
			} else {
				websiteButtonEl.removeAttribute('download');
				websiteButtonEl.target = '_blank';
				websiteButtonEl.rel = 'noreferrer';
			}
		}
		setModalOpen(chooserModal, true);
		stopPlayback();
		const closeButton = chooserModal.querySelector('.modal-close');
		if (closeButton && typeof closeButton.focus === 'function') closeButton.focus();
	};

	demoTriggers.forEach((trigger) => {
		trigger.addEventListener('click', (event) => {
			event.preventDefault();
			if ((trigger.dataset.projectDemoTrigger || '').toLowerCase() === 'mediguide') {
				activeProjectKey = 'mediguide';
				activeVideoIndex = 0;
				openVideoModalDirectly(trigger);
				return;
			}
			openChooserModal(trigger);
		});
	});

	if (openVideoButton) {
		openVideoButton.addEventListener('click', openVideoModal);
	}

	chooserCloseEls.forEach((el) => {
		el.addEventListener('click', () => closeModal(chooserModal));
	});

	videoCloseEls.forEach((el) => {
		el.addEventListener('click', () => {
			stopPlayback();
			closeModal(videoModal);
		});
	});

	document.addEventListener('keydown', (event) => {
		if (event.key !== 'Escape') return;
		if (videoModal.getAttribute('aria-hidden') === 'false') {
			stopPlayback();
			closeModal(videoModal);
			return;
		}
		if (chooserModal.getAttribute('aria-hidden') === 'false') {
			closeModal(chooserModal);
		}
	});
}

function initOjtCertificateModal() {
	const modal = $('#ojtCertificateModal');
	const trigger = $('[data-ojt-certificate-trigger]');
	if (!modal || !trigger) return;

	const closeEls = $$('[data-ojt-certificate-close]', modal);
	const closeButton = modal.querySelector('.modal-close');

	const closeModal = () => {
		setModalOpen(modal, false);
		const opener = modal.__opener;
		if (opener && typeof opener.focus === 'function') opener.focus();
	};

	const openModal = (opener) => {
		modal.__opener = opener;
		setModalOpen(modal, true);
		if (closeButton && typeof closeButton.focus === 'function') closeButton.focus();
	};

	trigger.addEventListener('click', () => {
		openModal(trigger);
	});

	closeEls.forEach((el) => {
		el.addEventListener('click', closeModal);
	});

	document.addEventListener('keydown', (event) => {
		if (modal.getAttribute('aria-hidden') !== 'false') return;
		if (event.key === 'Escape') closeModal();
	});
}

function initCertificateModal() {
	const modal = $('#certificateModal');
	if (!modal) return;

	const summaryEl = $('.modal-summary', modal);
	const avatarWrapEl = $('#certificateModalAvatarWrap', modal);
	const avatarEl = $('#certificateModalAvatar', modal);
	const completedByEl = $('#certificateModalCompletedBy');
	const completionDateEl = $('#certificateModalCompletionDate');
	const durationEl = $('#certificateModalDuration');
	const gradeEl = $('#certificateModalGrade');
	const verifyEl = $('#certificateModalVerify');
	const courseLinkEl = $('#certificateModalCourseLink');
	const logoEl = $('#certificateModalLogo');
	const learnedSectionEl = $('#certificateModalLearnedSection');
	const learnedListEl = $('#certificateModalLearned');
	const skillsSectionEl = $('#certificateModalSkillsSection');
	const skillsEl = $('#certificateModalSkills');
	const issuerEl = $('#certificateModalIssuer');
	const imageEl = $('#certificateModalImage');

	const setTextOrHide = (el, value) => {
		if (!el) return;
		const text = String(value || '').trim();
		el.textContent = text;
		el.style.display = text ? '' : 'none';
	};

	const setLinkOrDisable = (el, url, text) => {
		if (!el) return;
		el.textContent = String(text || '').trim();
		if (url) {
			el.href = url;
			el.style.pointerEvents = 'auto';
			el.setAttribute('aria-disabled', 'false');
		} else {
			el.href = '#';
			el.style.pointerEvents = 'none';
			el.setAttribute('aria-disabled', 'true');
		}
	};

	const closeModal = () => {
		setModalOpen(modal, false);
		const opener = modal.__opener;
		if (opener && typeof opener.focus === 'function') opener.focus();
	};

	const openModalForCard = (card) => {
		if (!card) return;
		modal.__opener = card;

		const title = card.dataset.title || '';
		const issuer = card.dataset.issuer || '';
		const image = card.dataset.image || '';
		const courseUrl = card.dataset.courseUrl || '';
		const showAwsLogo = (card.dataset.showAwsLogo || '').toLowerCase() === 'true';
		const logoSrc = card.dataset.logo || '';
		const logoAlt = card.dataset.logoAlt || '';
		const modalVariant = (card.dataset.modalVariant || '').trim();
		const avatarSrc = card.dataset.avatar || '';
		const avatarAlt = card.dataset.avatarAlt || '';
		const completedBy = card.dataset.completedBy || '';
		const completionDate = card.dataset.completionDate || '';
		const duration = card.dataset.duration || '';
		const grade = card.dataset.grade || '';
		const verifyText = card.dataset.verifyText || '';
		const learnedRaw = card.dataset.learned || '';
		const skillsRaw = card.dataset.skills || '';

		if (modalVariant) {
			modal.dataset.variant = modalVariant;
		} else {
			delete modal.dataset.variant;
		}

		if (avatarWrapEl && avatarEl) {
			const shouldShowAvatar = Boolean(String(avatarSrc).trim());
			avatarWrapEl.style.display = shouldShowAvatar ? '' : 'none';
			if (shouldShowAvatar) {
				avatarEl.src = avatarSrc;
				avatarEl.alt = avatarAlt;
			} else {
				avatarEl.removeAttribute('src');
				avatarEl.alt = '';
			}
		}

		setTextOrHide(issuerEl, issuer);
		setLinkOrDisable(courseLinkEl, courseUrl, title);

		if (logoEl) {
			const shouldShowLogo = Boolean(logoSrc) || showAwsLogo;
			logoEl.classList.toggle('is-visible', shouldShowLogo);
			if (shouldShowLogo) {
				if (logoSrc) {
					logoEl.src = logoSrc;
					logoEl.alt = logoAlt;
				} else {
					logoEl.src = 'assets/images/aws.jpg';
					logoEl.alt = 'AWS';
				}
			} else {
				logoEl.alt = '';
			}
		}

		setTextOrHide(completedByEl, completedBy);
		setTextOrHide(completionDateEl, completionDate);
		setTextOrHide(durationEl, duration);
		setTextOrHide(gradeEl, grade);
		if (verifyEl) {
			verifyEl.textContent = '';
			verifyEl.style.display = verifyText || (courseUrl && title) ? '' : 'none';
			if (verifyText) verifyEl.appendChild(document.createTextNode(verifyText));
			if (courseUrl && title) {
				const link = document.createElement('a');
				link.href = courseUrl;
				link.target = '_blank';
				link.rel = 'noreferrer';
				link.textContent = title;
				verifyEl.appendChild(link);
				verifyEl.appendChild(document.createTextNode('.'));
			}
		}
		if (summaryEl) {
			const hasSummary =
				String(completedBy).trim() ||
				String(completionDate).trim() ||
				String(duration).trim() ||
				String(grade).trim() ||
				String(verifyText).trim();
			summaryEl.style.display = hasSummary ? '' : 'none';
		}

		if (learnedSectionEl && learnedListEl) {
			learnedListEl.innerHTML = '';
			const items = learnedRaw.split('|').map((x) => x.trim()).filter(Boolean);
			learnedSectionEl.style.display = items.length ? '' : 'none';
			items.forEach((item) => {
				const li = document.createElement('li');
				li.textContent = item;
				learnedListEl.appendChild(li);
			});
		}

		if (skillsSectionEl && skillsEl) {
			skillsEl.innerHTML = '';
			const skills = skillsRaw.split('|').map((x) => x.trim()).filter(Boolean);
			skillsSectionEl.style.display = skills.length ? '' : 'none';
			skills.forEach((skill) => {
				const chip = document.createElement('span');
				chip.className = 'modal-skill';
				chip.textContent = skill;
				skillsEl.appendChild(chip);
			});
		}

		if (imageEl) {
			imageEl.src = image;
			imageEl.alt = title ? `Certificate preview: ${title}` : 'Certificate preview';
		}

		setModalOpen(modal, true);
		const closeButton = modal.querySelector('[data-modal-close]');
		if (closeButton && typeof closeButton.focus === 'function') closeButton.focus();
	};

	$$('.certificate-card[role="button"]').forEach((card) => {
		card.addEventListener('click', () => openModalForCard(card));
		card.addEventListener('keydown', (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				openModalForCard(card);
			}
		});
	});

	$$('[data-modal-close]', modal).forEach((el) => {
		el.addEventListener('click', closeModal);
	});

	document.addEventListener('keydown', (event) => {
		if (modal.getAttribute('aria-hidden') !== 'false') return;
		if (event.key === 'Escape') closeModal();
	});
}

function initCertificatesCarousel() {
	const section = $('#certificates');
	if (!section) return;

	const viewport = $('.cert-carousel-viewport', section);
	const prevBtn = $('.cert-carousel-prev', section);
	const nextBtn = $('.cert-carousel-next', section);
	const dotsEl = $('.cert-carousel-dots', section);

	if (!viewport || !dotsEl) return;

	let dotButtons = [];
	let isTicking = false;

	const getPageCount = () => {
		const pageWidth = viewport.clientWidth;
		if (!pageWidth) return 1;
		return Math.max(1, Math.ceil(viewport.scrollWidth / pageWidth));
	};

	const getCurrentPage = () => {
		const pageWidth = viewport.clientWidth;
		if (!pageWidth) return 0;
		return Math.min(
			getPageCount() - 1,
			Math.max(0, Math.floor((viewport.scrollLeft + pageWidth / 2) / pageWidth))
		);
	};

	const scrollToPage = (pageIndex) => {
		const pageWidth = viewport.clientWidth;
		viewport.scrollTo({ left: pageIndex * pageWidth, behavior: 'smooth' });
	};

	const updateControls = () => {
		const pageCount = getPageCount();
		const current = getCurrentPage();
		const atStart = pageCount <= 1 || current <= 0;
		const atEnd = pageCount <= 1 || current >= pageCount - 1;

		if (prevBtn) {
			prevBtn.disabled = atStart;
			prevBtn.classList.toggle('is-hidden', atStart);
		}
		if (nextBtn) {
			nextBtn.disabled = atEnd;
			nextBtn.classList.toggle('is-hidden', atEnd);
		}
		dotButtons.forEach((btn, idx) => {
			btn.setAttribute('aria-current', idx === current ? 'true' : 'false');
		});
	};

	const requestUpdate = () => {
		if (isTicking) return;
		isTicking = true;
		requestAnimationFrame(() => {
			isTicking = false;
			updateControls();
		});
	};

	const buildDots = () => {
		dotsEl.innerHTML = '';
		dotButtons = [];
		const pages = getPageCount();
		for (let i = 0; i < pages; i += 1) {
			const btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'cert-carousel-dot';
			btn.setAttribute('role', 'tab');
			btn.setAttribute('aria-label', `Go to certificates page ${i + 1}`);
			btn.addEventListener('click', () => scrollToPage(i));
			dotsEl.appendChild(btn);
			dotButtons.push(btn);
		}
		updateControls();
	};

	if (prevBtn) prevBtn.addEventListener('click', () => viewport.scrollBy({ left: -viewport.clientWidth, behavior: 'smooth' }));
	if (nextBtn) nextBtn.addEventListener('click', () => viewport.scrollBy({ left: viewport.clientWidth, behavior: 'smooth' }));

	viewport.addEventListener('scroll', requestUpdate, { passive: true });
	window.addEventListener('resize', buildDots);

	buildDots();
}

document.addEventListener('DOMContentLoaded', () => {
	initProjectPagination();
	initProjectFilters();
	initProjectDemoFlow();
	initOjtCertificateModal();
	initCertificatesCarousel();
	initCertificateModal();
	initFooterYear();
});
