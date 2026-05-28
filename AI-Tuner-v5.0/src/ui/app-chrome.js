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

        root.innerHTML =
            '<div class="aituner-chrome" role="toolbar" aria-label="App controls">' +
            (showHome
                ? '<a class="aituner-chrome-home aituner-chrome-btn" href="' +
                  homeHref +
                  '">' +
                  homeLabel +
                  '</a>'
                : '<span class="aituner-chrome-spacer" aria-hidden="true"></span>') +
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
