/**
 * Persistent top chrome: Home link, theme toggle, No Emojis (v4.0 parity).
 */
(function (global) {
    'use strict';

    var STORAGE_THEME = 'aituner-theme';
    var STORAGE_EMOJI = 'aiTunerEmojiShutoff';

    function setChromeHeightVar(root) {
        try {
            var chrome = root && root.querySelector ? root.querySelector('.aituner-chrome') : null;
            if (!chrome) {
                return;
            }
            var h = Math.ceil(chrome.getBoundingClientRect().height || chrome.offsetHeight || 0);
            if (h > 0) {
                document.documentElement.style.setProperty('--aituner-chrome-height', h + 'px');
            }
        } catch (e) {
            /* ignore */
        }
    }

    function watchChromeHeight(root) {
        setChromeHeightVar(root);

        var onResize = function () {
            global.requestAnimationFrame(function () {
                setChromeHeightVar(root);
            });
        };

        try {
            global.addEventListener('resize', onResize);
            global.addEventListener('orientationchange', onResize);
        } catch (e) {
            /* ignore */
        }

        if (typeof global.ResizeObserver === 'function') {
            try {
                var chrome = root && root.querySelector ? root.querySelector('.aituner-chrome') : null;
                if (!chrome) {
                    return;
                }
                var ro = new global.ResizeObserver(function () {
                    setChromeHeightVar(root);
                });
                ro.observe(chrome);
            } catch (e) {
                /* ignore */
            }
        }
    }

    function readEmojiEnabled() {
        try {
            return localStorage.getItem(STORAGE_EMOJI) === 'true';
        } catch (e) {
            return false;
        }
    }

    function writeEmojiEnabled(on) {
        try {
            localStorage.setItem(STORAGE_EMOJI, on ? 'true' : 'false');
        } catch (e) {
            /* ignore */
        }
    }

    function applyThemeClasses() {
        var stored = '';
        try {
            stored = localStorage.getItem(STORAGE_THEME);
        } catch (e) {
            /* ignore */
        }
        document.body.classList.remove('aituner-dark', 'aituner-light');
        if (stored === 'light') {
            document.body.classList.add('aituner-light');
        } else {
            document.body.classList.add('aituner-dark');
        }
    }

    function isLightTheme() {
        return document.body.classList.contains('aituner-light');
    }

    function updateThemeButton(btn) {
        if (!btn) {
            return;
        }
        btn.textContent = isLightTheme() ? 'Dark Mode' : 'Light Mode';
        btn.setAttribute(
            'aria-label',
            isLightTheme() ? 'Switch to dark mode' : 'Switch to light mode'
        );
    }

    function updateEmojiButton(btn, active) {
        if (!btn) {
            return;
        }
        btn.textContent = 'No Emojis';
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        btn.classList.toggle('aituner-chrome-btn-active', active);
    }

    function notifyThemeChange() {
        try {
            global.dispatchEvent(new Event('aituner-theme-changed'));
        } catch (e) {
            /* ignore */
        }
    }

    function syncEngineEmoji(engine, on) {
        if (engine && typeof engine.setEmojiShutoff === 'function') {
            engine.setEmojiShutoff(on);
        }
    }

    function mount(options) {
        options = options || {};
        var rootId = options.rootId || 'aituner-chrome-root';
        var root = document.getElementById(rootId);
        if (!root) {
            root = document.createElement('div');
            root.id = rootId;
            document.body.insertBefore(root, document.body.firstChild);
        }

        applyThemeClasses();
        document.body.classList.add('has-aituner-chrome');

        var emojiOn = readEmojiEnabled();
        var engine = options.engine || null;
        if (engine && typeof engine.loadEmojiShutoffPreference === 'function') {
            engine.loadEmojiShutoffPreference();
            emojiOn = !!engine.emojiShutoff;
        } else {
            syncEngineEmoji(engine, emojiOn);
        }

        var showHome = !!options.showHomeLink;
        var showProfile = !!options.showProfileButton;
        var homeHref = options.homeHref || 'index.html';
        var homeLabel = options.homeLabel || '← Home';

        var sparxionLogo =
            '<a class="aituner-chrome-sparxion" href="https://sparxion.com" target="_blank" rel="noopener noreferrer" aria-label="SparXion home"><svg class="aituner-chrome-sparxion-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 517.1 143.1" aria-hidden="true" focusable="false"><path fill="currentColor" d="M46.6,72.5l-18.9-2.3c-3-.4-5.3-1.4-6.9-3.1-1.6-1.7-2.5-4.6-2.5-8.7s.6-7,1.9-8.7c1.2-1.8,3.2-2.8,5.8-3.2,2.7-.4,6-.5,10.2-.4,3.4,0,7,.2,10.7.3,3.7.2,7.3.3,10.7.6l.4-2.1c-2.3-.3-4.6-.6-7.1-.8s-5-.4-7.5-.5c-2.5-.1-4.9-.2-7.1-.2-4.5,0-8.3.1-11.4.6-3.1.5-5.4,1.8-7,3.9-1.6,2.1-2.3,5.5-2.3,10.3s.5,5.8,1.4,7.8,2.3,3.6,4.2,4.6c1.8,1.1,4,1.7,6.6,2l18.9,2.3c2.8.3,5.2,1.3,7.1,2.9,1.9,1.6,2.9,4.5,2.9,8.7s-.6,6.5-1.9,8.4-3.3,3-6.1,3.6c-2.8.6-6.5.9-11.2,1-2.5,0-4.8,0-6.9,0-2.1,0-4.2-.1-6.3-.2-2.1-.1-4.4-.3-6.9-.5l-.4,2.1c4.3.5,8.1.9,11.3,1.1s6.3.2,9,.2c4.8,0,8.8-.3,12-.9,3.3-.6,5.8-2,7.5-4.2,1.7-2.2,2.6-5.7,2.6-10.4s-1.1-7.8-3.3-10.1c-2.2-2.3-5.3-3.7-9.5-4.2ZM103.6,43.5c-2.6,0-5.1.4-7.6,1.3-2.5.9-5,2.1-7.6,3.9-2.6,1.7-5.3,3.9-8.1,6.4l-.5-10.2h-2.1v80.7h2.8v-24c0-1.6-.1-3.4-.3-5.4,4.1,2,8,3.5,11.9,4.6,3.9,1.1,7.7,1.6,11.5,1.6s8.8-1,11.8-2.9,5.1-5.1,6.5-9.4c1.4-4.3,2-10,2-17.1,0-10.7-1.5-18.3-4.6-22.7-3.1-4.5-8.3-6.7-15.7-6.7ZM119.3,88.6c-1.2,3.9-3,6.7-5.6,8.5-2.5,1.8-5.9,2.6-10.1,2.6s-7.4-.5-10.9-1.5c-3.4-.9-7.5-2.4-12.1-4.2v-36.6c4.6-3.9,8.7-6.8,12.1-8.6,3.5-1.8,7.2-2.7,10.9-2.7s7.6.9,10.1,2.6c2.5,1.7,4.4,4.5,5.6,8.5,1.2,3.9,1.8,9.2,1.8,15.7s-.6,11.8-1.8,15.7ZM177.3,45.1c-2.3-1.1-5.1-1.6-8.3-1.6s-7.4.1-10.5.4c-3.1.3-6,.6-8.6.9-2.6.4-5.2.7-7.7,1.1l.3,2.1c4.1-.5,8.5-1,13.1-1.3,4.6-.4,9-.5,13.2-.5s8.4,1.3,10.2,3.8c1.8,2.5,2.7,5.6,2.7,9.2v8h-28.3c-4.3,0-7.6,1.2-9.9,3.5-2.3,2.3-3.5,5.6-3.5,9.8v7.3c0,3,.6,5.6,1.8,7.7,1.2,2.1,2.8,3.7,5,4.8,2.2,1.1,4.8,1.6,7.8,1.6s5.6-.4,8.4-1.2c2.8-.8,5.5-1.8,8-3,2.5-1.2,4.7-2.6,6.7-3.9,1.7-1.2,3.1-2.3,4.1-3.4l.6,10.9h2.1v-41.9c0-3.7-.6-6.8-1.9-9.1-1.2-2.3-3-4-5.4-5ZM181.7,87.3c-2,1.9-4.4,3.8-7.4,5.5-3.2,1.9-6.5,3.4-10,4.6s-6.7,1.7-9.8,1.6c-3.8,0-6.7-1.1-8.7-3-2-1.9-3-4.7-3-8.4v-7.3c0-3.4.9-5.9,2.7-7.7,1.8-1.8,4.4-2.7,7.8-2.7l28.3-.5v17.8ZM222.2,46.6c-4.3,2.1-8.8,4.9-13.5,8.6l-.4-10.3h-2.1v56.1h2.8v-43.4c5.2-3.6,9.7-6.4,13.6-8.4,4-2,8-3,12-3h2l.6-2.7h-2.2c-4.2,0-8.5,1-12.8,3.1ZM315.9,101h2.8v-56.1h-2.8v56.1ZM377.4,46.4c-3.6-1.9-8.4-2.9-14.5-2.9s-10.8,1-14.4,2.9c-3.6,1.9-6.2,5-7.8,9.3-1.6,4.3-2.3,10.1-2.3,17.3s.8,12.9,2.3,17.2c1.6,4.3,4.2,7.4,7.8,9.4,3.6,1.9,8.4,2.9,14.4,2.9s10.9-1,14.5-2.9c3.6-1.9,6.2-5,7.7-9.4,1.6-4.3,2.3-10.1,2.3-17.4s-.8-12.9-2.3-17.2c-1.6-4.3-4.1-7.4-7.7-9.3ZM382.4,88.9c-1.4,3.9-3.7,6.7-6.8,8.4-3.2,1.6-7.4,2.5-12.7,2.5s-9.5-.8-12.7-2.5c-3.2-1.6-5.4-4.4-6.8-8.4-1.4-3.9-2.1-9.3-2.1-16s.7-12.1,2.1-16c1.4-3.9,3.7-6.7,6.8-8.3,3.2-1.6,7.4-2.5,12.7-2.5s9.5.8,12.7,2.5c3.2,1.6,5.4,4.4,6.8,8.3,1.4,3.9,2.1,9.2,2.1,16s-.7,12-2.1,16ZM436.5,43.5c-4.4,0-8.8,1-13.3,2.9-4.5,1.9-9.2,4.9-14,8.8l-.4-10.3h-2.1v56.1h2.8v-43.4c5.4-3.8,10-6.6,14-8.5,4-1.9,8.2-2.9,12.5-2.9s7.6,1.1,9.7,3.2c2.1,2.1,3.2,5.4,3.2,9.8v41.9h2.8v-42.2c0-10.2-5-15.3-15.1-15.3ZM241.6,46.1l17.1,28-17,26.9h14.9l16-26.9-16.4-28h-14.6ZM485.2,43.6h-14.6l17.1,28-18.5,29.5h0l-13.8,22h15.6l30.6-51.5-16.4-28ZM317.9,17.4h-15.6l-30.6,51.5,19.1,32.1h14.9l-20.1-32.1,32.3-51.5Z"/></svg></a>';

        root.innerHTML =
            '<div class="aituner-chrome" role="toolbar" aria-label="App controls">' +
            '<div class="aituner-chrome-leading">' +
            sparxionLogo +
            (showHome
                ? '<a class="aituner-chrome-home aituner-chrome-btn" href="' +
                  homeHref +
                  '">' +
                  homeLabel +
                  '</a>'
                : '') +
            '</div>' +
            '<span class="aituner-chrome-spacer" aria-hidden="true"></span>' +
            '<div class="aituner-chrome-actions">' +
            '<button type="button" class="aituner-chrome-btn" id="aituner-origin-story">Origin Story</button>' +
            '<button type="button" class="aituner-chrome-btn" id="aituner-emoji-toggle">No Emojis</button>' +
            '<button type="button" class="aituner-chrome-btn" id="aituner-theme-toggle">Light Mode</button>' +
            (showProfile
                ? '<button type="button" class="aituner-chrome-btn tier-badge" id="tier-badge" aria-haspopup="dialog" aria-label="My profile">My Profile</button>'
                : '') +
            '</div>' +
            '</div>';

        watchChromeHeight(root);

        var themeBtn = document.getElementById('aituner-theme-toggle');
        var emojiBtn = document.getElementById('aituner-emoji-toggle');
        var originBtn = document.getElementById('aituner-origin-story');

        updateThemeButton(themeBtn);
        updateEmojiButton(emojiBtn, emojiOn);

        if (originBtn) {
            originBtn.addEventListener('click', function () {
                if (global.AITunerOriginStory && typeof global.AITunerOriginStory.open === 'function') {
                    global.AITunerOriginStory.open();
                }
            });
        }

        themeBtn.addEventListener('click', function () {
            var nextLight = !isLightTheme();
            try {
                if (nextLight) {
                    localStorage.setItem(STORAGE_THEME, 'light');
                } else {
                    localStorage.removeItem(STORAGE_THEME);
                }
            } catch (e) {
                /* ignore */
            }
            applyThemeClasses();
            updateThemeButton(themeBtn);
            notifyThemeChange();
        });

        emojiBtn.addEventListener('click', function () {
            emojiOn = !emojiOn;
            writeEmojiEnabled(emojiOn);
            updateEmojiButton(emojiBtn, emojiOn);
            if (engine && typeof engine.setEmojiShutoff === 'function') {
                engine.setEmojiShutoff(emojiOn);
            } else {
                syncEngineEmoji(engine, emojiOn);
            }
        });

        return {
            setEngine: function (eng) {
                engine = eng;
                if (engine && typeof engine.loadEmojiShutoffPreference === 'function') {
                    engine.loadEmojiShutoffPreference();
                    emojiOn = !!engine.emojiShutoff;
                    updateEmojiButton(emojiBtn, emojiOn);
                }
            }
        };
    }

    global.AITunerAppChrome = {
        mount: mount,
        applyTheme: applyThemeClasses,
        readEmojiEnabled: readEmojiEnabled
    };
})(typeof window !== 'undefined' ? window : globalThis);
