document.addEventListener('DOMContentLoaded', () => {
    // 1. Application State
    const state = {
        openTabs: [], // array of { id, folder, filename, isPinned }
        activeTabId: null,
        theme: localStorage.getItem('theme') || 'dark',
        markmapInstance: null,
        // Keep track of folder collapsed states
        collapsedFolders: {
            'AFM': true,
            'Audit': true,
            'FR': true,
            'IDT': true,
            'SPOM': true
        }
    };

    // 2. DOM Elements
    const elements = {
        appContainer: document.querySelector('.app-container'),
        fileTreeRoot: document.getElementById('file-tree-root'),
        fileSearch: document.getElementById('file-search'),
        searchClearBtn: document.getElementById('search-clear-btn'),
        tabsBar: document.getElementById('tabs-bar'),
        welcomeScreen: document.getElementById('welcome-screen'),
        markmapViewContainer: document.getElementById('markmap-view-container'),
        markmapSvg: document.getElementById('markmap-svg'),
        folderShortcuts: document.getElementById('folder-shortcuts'),
        
        // Mobile layout
        mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
        mobileThemeToggle: document.getElementById('mobile-theme-toggle'),
        sidebarOverlay: document.getElementById('sidebar-overlay'),
        
        // Toolbar
        btnThemeToggle: document.getElementById('btn-theme-toggle'),
        toolbarZoomIn: document.getElementById('toolbar-zoom-in'),
        toolbarZoomOut: document.getElementById('toolbar-zoom-out'),
        toolbarFit: document.getElementById('toolbar-fit'),
        toolbarExport: document.getElementById('toolbar-export'),
        exportDropdown: document.getElementById('export-dropdown'),
        exportSvgBtn: document.getElementById('export-svg-btn'),
        exportPngBtn: document.getElementById('export-png-btn')
    };

    // 3. Initialize App
    function init() {
        applyTheme(state.theme);
        renderFileTree();
        renderFolderShortcuts();
        setupEventListeners();
        
        // Select first folder to expand for a better first-time view
        const firstFolder = Object.keys(window.MARKMAP_FILES || {})[0];
        if (firstFolder) {
            toggleFolder(firstFolder, false); // Expand first folder
        }
    }

    // 4. Theme Management
    function applyTheme(themeName) {
        state.theme = themeName;
        localStorage.setItem('theme', themeName);
        
        if (themeName === 'dark') {
            document.body.classList.remove('theme-light');
            document.body.classList.add('theme-dark');
            elements.btnThemeToggle.querySelector('.moon-icon').classList.remove('hidden');
            elements.btnThemeToggle.querySelector('.sun-icon').classList.add('hidden');
        } else {
            document.body.classList.remove('theme-dark');
            document.body.classList.add('theme-light');
            elements.btnThemeToggle.querySelector('.moon-icon').classList.add('hidden');
            elements.btnThemeToggle.querySelector('.sun-icon').classList.remove('hidden');
        }

        // Re-fit markmap if it exists so colors adjust
        if (state.markmapInstance) {
            // Give a tiny timeout for CSS variables to apply in DOM
            setTimeout(() => {
                state.markmapInstance.fit();
            }, 50);
        }
    }

    function toggleTheme() {
        const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    }

    // 5. File Tree Rendering
    function renderFileTree(searchQuery = '') {
        elements.fileTreeRoot.innerHTML = '';
        const filesData = window.MARKMAP_FILES || {};
        
        const q = searchQuery.toLowerCase().trim();

        Object.keys(filesData).forEach(folderName => {
            const files = filesData[folderName];
            const filteredFiles = files.filter(file => file.toLowerCase().includes(q));
            
            // If we are searching and there are no matching files, don't show the folder
            if (q && filteredFiles.length === 0) return;

            const isCollapsed = q ? false : state.collapsedFolders[folderName]; // auto expand when searching

            // Create Folder LI
            const folderLi = document.createElement('li');
            folderLi.className = 'folder-item';

            const folderNode = document.createElement('div');
            folderNode.className = 'tree-node';
            
            // Chevron arrow
            const arrowSpan = document.createElement('span');
            arrowSpan.className = 'tree-icon folder-arrow' + (isCollapsed ? ' collapsed' : '');
            arrowSpan.innerHTML = '<svg viewBox="0 0 24 24" style="width:14px;height:14px;"><path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>';
            
            // Folder icon
            const iconSpan = document.createElement('span');
            iconSpan.className = 'tree-icon folder-icon';
            iconSpan.innerHTML = '<svg viewBox="0 0 24 24" style="width:16px;height:16px;"><path fill="currentColor" d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>';

            // Title
            const titleSpan = document.createElement('span');
            titleSpan.className = 'node-title';
            titleSpan.textContent = folderName;

            folderNode.appendChild(arrowSpan);
            folderNode.appendChild(iconSpan);
            folderNode.appendChild(titleSpan);
            folderLi.appendChild(folderNode);

            // Create Folder UL (for files)
            const filesUl = document.createElement('ul');
            if (isCollapsed) {
                filesUl.className = 'collapsed';
            }

            // Click event to expand/collapse folder
            folderNode.addEventListener('click', () => {
                if (!q) {
                    toggleFolder(folderName);
                }
            });

            // Populate files
            const filesToRender = q ? filteredFiles : files;
            filesToRender.forEach(filename => {
                const fileLi = document.createElement('li');
                const fileId = `${folderName}/${filename}`;

                const fileNode = document.createElement('div');
                fileNode.className = 'tree-node file-node';
                if (state.activeTabId === fileId) {
                    fileNode.classList.add('selected');
                }

                // File icon (Markdown M icon)
                const fileIconSpan = document.createElement('span');
                fileIconSpan.className = 'tree-icon file-icon';
                fileIconSpan.innerHTML = '<svg viewBox="0 0 24 24" style="width:15px;height:15px;"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>';

                const fileTitleSpan = document.createElement('span');
                fileTitleSpan.className = 'node-title';
                // Remove the extension .md for display in sidebar
                fileTitleSpan.textContent = filename.replace(/\.md$/i, '');

                fileNode.appendChild(fileIconSpan);
                fileNode.appendChild(fileTitleSpan);
                fileLi.appendChild(fileNode);
                filesUl.appendChild(fileLi);

                // Open file on click
                fileNode.addEventListener('click', () => {
                    openFile(folderName, filename);
                });
            });

            folderLi.appendChild(filesUl);
            elements.fileTreeRoot.appendChild(folderLi);
        });
    }

    function toggleFolder(folderName, forceToggle = null) {
        const shouldCollapse = forceToggle !== null ? forceToggle : !state.collapsedFolders[folderName];
        state.collapsedFolders[folderName] = shouldCollapse;
        renderFileTree(elements.fileSearch.value);
    }

    // 6. Tabs Management
    function renderTabs() {
        elements.tabsBar.innerHTML = '';

        state.openTabs.forEach(tab => {
            const tabEl = document.createElement('div');
            tabEl.className = 'tab';
            if (tab.id === state.activeTabId) tabEl.classList.add('active');
            if (!tab.isPinned) tabEl.classList.add('preview');

            tabEl.setAttribute('data-id', tab.id);

            const titleSpan = document.createElement('span');
            titleSpan.className = 'tab-title';
            titleSpan.textContent = tab.filename.replace(/\.md$/i, '');

            const closeSpan = document.createElement('span');
            closeSpan.className = 'tab-close';
            closeSpan.textContent = '✕';
            
            tabEl.appendChild(titleSpan);
            tabEl.appendChild(closeSpan);
            elements.tabsBar.appendChild(tabEl);

            // Tab click events
            tabEl.addEventListener('click', (e) => {
                if (e.target.classList.contains('tab-close')) {
                    closeTab(tab.id, e);
                } else {
                    activateTab(tab.id);
                }
            });

        });

        // Update selected file styling in explorer sidebar
        document.querySelectorAll('.file-node').forEach(node => {
            node.classList.remove('selected');
        });
        
        // Re-apply select to the active tree node if visible
        renderFileTree(elements.fileSearch.value);
    }

    function openFile(folder, filename) {
        const tabId = `${folder}/${filename}`;
        const existingTab = state.openTabs.find(t => t.id === tabId);

        if (existingTab) {
            activateTab(tabId);
            return;
        }

        // Add a new tab
        state.openTabs.push({
            id: tabId,
            folder: folder,
            filename: filename,
            isPinned: true
        });
        activateTab(tabId);

        // Close mobile sidebar after choosing file
        if (window.innerWidth <= 768) {
            elements.appContainer.classList.remove('sidebar-open');
        }
    }

    function activateTab(tabId) {
        state.activeTabId = tabId;
        renderTabs();
        
        const tab = state.openTabs.find(t => t.id === tabId);
        if (tab) {
            fetchAndRenderMarkdown(tab.folder, tab.filename);
        }
    }

    function closeTab(tabId, event) {
        if (event) event.stopPropagation();

        const tabIndex = state.openTabs.findIndex(t => t.id === tabId);
        if (tabIndex === -1) return;

        state.openTabs.splice(tabIndex, 1);

        if (state.activeTabId === tabId) {
            if (state.openTabs.length > 0) {
                // Activate the adjacent tab
                const nextActiveIndex = Math.min(tabIndex, state.openTabs.length - 1);
                activateTab(state.openTabs[nextActiveIndex].id);
            } else {
                state.activeTabId = null;
                showWelcomeScreen();
                renderTabs();
            }
        } else {
            renderTabs();
        }
    }


    function showWelcomeScreen() {
        elements.welcomeScreen.classList.remove('hidden');
        elements.markmapViewContainer.classList.add('hidden');
        
        // Reset SVG node
        elements.markmapSvg.innerHTML = '';
        state.markmapInstance = null;
    }

    function hideWelcomeScreen() {
        elements.welcomeScreen.classList.add('hidden');
        elements.markmapViewContainer.classList.remove('hidden');
    }

    // 7. Welcome Page Shortcuts
    function renderFolderShortcuts() {
        elements.folderShortcuts.innerHTML = '';
        const filesData = window.MARKMAP_FILES || {};

        Object.keys(filesData).forEach(folderName => {
            const btn = document.createElement('button');
            btn.className = 'folder-shortcut-btn';
            
            // Icon
            btn.innerHTML = `
                <svg viewBox="0 0 24 24" style="width:20px;height:20px;display:block;margin:0 auto 6px auto;"><path fill="currentColor" d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                <span>${folderName}</span>
            `;

            btn.addEventListener('click', () => {
                // Focus search or open folder
                toggleFolder(folderName, false); // Expand folder
                
                // Open first file in that folder if available
                const firstFile = filesData[folderName][0];
                if (firstFile) {
                    openFile(folderName, firstFile, false);
                }
            });

            elements.folderShortcuts.appendChild(btn);
        });
    }

    // 8. Fetch & Render Markdown Content
    function fetchAndRenderMarkdown(folder, filename) {
        hideWelcomeScreen();
        
        // Show loading status (optional, but keep it clean)
        elements.markmapSvg.innerHTML = '<g><text x="20" y="30" fill="var(--text-muted)">Loading mind map...</text></g>';
        
        // Correctly encode special characters like '#' and spaces in file paths
        const fileUrl = `${folder}/${encodeURIComponent(filename)}`;
        
        fetch(fileUrl)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.text();
            })
            .then(markdown => {
                renderMarkmap(markdown);
            })
            .catch(err => {
                console.error('Failed to load markdown file:', err);
                elements.markmapSvg.innerHTML = `
                    <g>
                        <text x="20" y="30" fill="#e06c75" font-weight="bold">Error loading file</text>
                        <text x="20" y="55" fill="var(--text-muted)">Please verify that the file exists: ${folder}/${filename}</text>
                    </g>
                `;
            });
    }

    function renderMarkmap(markdownText) {
        // Clear SVG first
        elements.markmapSvg.innerHTML = '';
        
        try {
            const { Transformer, Markmap, loadCSS, loadJS } = window.markmap;
            const transformer = new Transformer();
            
            // Clean up YAML frontmatter if present (markmap handles it, but sometimes initialExpandLevel is specified there)
            // e.g.
            // ---
            // markmap:
            //   initialExpandLevel: 2
            // ---
            const { root, features } = transformer.transform(markdownText);
            const { styles, scripts } = transformer.getUsedAssets(features);

            if (styles) loadCSS(styles);
            if (scripts) loadJS(scripts, { getMarkmap: () => window.markmap });

            // Create options object
            const options = {
                autoFit: true,
                duration: 250,
                fitRatio: 0.95
            };

            // Build Markmap
            state.markmapInstance = Markmap.create('#markmap-svg', options, root);
        } catch (error) {
            console.error('Error rendering markmap:', error);
            elements.markmapSvg.innerHTML = `<g><text x="20" y="30" fill="#e06c75">Rendering error: ${error.message}</text></g>`;
        }
    }

    // 9. Zoom & Fit controls
    function zoomIn() {
        if (!state.markmapInstance) return;
        const { zoom, svg } = state.markmapInstance;
        zoom.scaleBy(svg.transition().duration(200), 1.3);
    }

    function zoomOut() {
        if (!state.markmapInstance) return;
        const { zoom, svg } = state.markmapInstance;
        zoom.scaleBy(svg.transition().duration(200), 0.77);
    }

    function fitScreen() {
        if (!state.markmapInstance) return;
        state.markmapInstance.fit();
    }

    // 10. SVG & PNG Export
    function getExportFilename(extension) {
        if (state.activeTabId) {
            const parts = state.activeTabId.split('/');
            const name = parts[parts.length - 1].replace(/\.md$/i, '');
            return `${name}${extension}`;
        }
        return `markmap${extension}`;
    }

    function exportSVG() {
        const svgEl = elements.markmapSvg;
        if (!svgEl || !state.markmapInstance) return;

        // Clone the SVG element so we don't mess up the active page render
        const clonedSvg = svgEl.cloneNode(true);
        
        // Clean up classes/ids that might interfere
        clonedSvg.removeAttribute('class');
        clonedSvg.style.backgroundColor = state.theme === 'dark' ? '#1e1e1e' : '#ffffff';

        // Add explicit stylesheet rules for nodes so standard viewers render it correctly
        const styleEl = document.createElement('style');
        const textColor = state.theme === 'dark' ? '#cccccc' : '#333333';
        const bgColor = state.theme === 'dark' ? '#1e1e1e' : '#ffffff';
        styleEl.innerHTML = `
            svg { background-color: ${bgColor}; font-family: system-ui, -apple-system, sans-serif; }
            g.markmap-node text { fill: ${textColor} !important; font-family: system-ui, -apple-system, sans-serif !important; font-size: 13px !important; }
            g.markmap-node circle { fill: ${bgColor} !important; stroke-width: 1.5px !important; }
            path.markmap-link { stroke-width: 1.5px !important; }
        `;
        clonedSvg.appendChild(styleEl);

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(clonedSvg);

        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = getExportFilename('.svg');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }

    function exportPNG() {
        const svgEl = elements.markmapSvg;
        if (!svgEl || !state.markmapInstance) return;

        // Bounding box of content or size of current view
        const rect = svgEl.getBoundingClientRect();
        const width = rect.width || 1200;
        const height = rect.height || 800;

        const clonedSvg = svgEl.cloneNode(true);
        clonedSvg.setAttribute('width', width);
        clonedSvg.setAttribute('height', height);

        // Inject stylesheet for PNG drawing
        const styleEl = document.createElement('style');
        const textColor = state.theme === 'dark' ? '#cccccc' : '#333333';
        const bgColor = state.theme === 'dark' ? '#1e1e1e' : '#ffffff';
        styleEl.innerHTML = `
            svg { background-color: ${bgColor}; font-family: system-ui, -apple-system, sans-serif; }
            g.markmap-node text { fill: ${textColor} !important; font-family: system-ui, -apple-system, sans-serif !important; font-size: 13px !important; }
            g.markmap-node circle { fill: ${bgColor} !important; stroke-width: 1.5px !important; }
            path.markmap-link { stroke-width: 1.5px !important; }
        `;
        clonedSvg.appendChild(styleEl);

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(clonedSvg);

        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = 2; // 2x high resolution
            canvas.width = width * scale;
            canvas.height = height * scale;

            const ctx = canvas.getContext('2d');
            ctx.scale(scale, scale);

            // Draw bg
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);

            // Draw image
            ctx.drawImage(image, 0, 0, width, height);

            try {
                const pngUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = pngUrl;
                link.download = getExportFilename('.png');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (err) {
                console.error('Failed to convert canvas to PNG URL:', err);
                alert('Could not export PNG. This is usually due to CORS/security restrictions in your local browser sandbox.');
            }
            URL.revokeObjectURL(url);
        };
        
        image.onerror = (err) => {
            console.error('Error loading SVG onto Image tag:', err);
            URL.revokeObjectURL(url);
        };

        image.src = url;
    }

    // 11. Event Listeners Setup
    function setupEventListeners() {
        // Toggle theme (Activity Bar)
        elements.btnThemeToggle.addEventListener('click', toggleTheme);
        elements.mobileThemeToggle.addEventListener('click', toggleTheme);

        // Sidebar search input
        elements.fileSearch.addEventListener('input', (e) => {
            const query = e.target.value;
            if (query.trim()) {
                elements.searchClearBtn.classList.remove('hidden');
            } else {
                elements.searchClearBtn.classList.add('hidden');
            }
            renderFileTree(query);
        });

        // Search clear button
        elements.searchClearBtn.addEventListener('click', () => {
            elements.fileSearch.value = '';
            elements.searchClearBtn.classList.add('hidden');
            renderFileTree();
        });

        // Mobile drawer toggle
        elements.mobileMenuToggle.addEventListener('click', () => {
            elements.appContainer.classList.toggle('sidebar-open');
        });

        elements.sidebarOverlay.addEventListener('click', () => {
            elements.appContainer.classList.remove('sidebar-open');
        });

        // Toolbar zoom/fit buttons
        elements.toolbarZoomIn.addEventListener('click', zoomIn);
        elements.toolbarZoomOut.addEventListener('click', zoomOut);
        elements.toolbarFit.addEventListener('click', fitScreen);

        // Export dropdown trigger
        elements.toolbarExport.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.exportDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            elements.exportDropdown.classList.remove('show');
        });

        // Export item triggers
        elements.exportSvgBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.exportDropdown.classList.remove('show');
            exportSVG();
        });

        elements.exportPngBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.exportDropdown.classList.remove('show');
            exportPNG();
        });

        // Window resize re-fits the mindmap
        window.addEventListener('resize', () => {
            if (state.markmapInstance) {
                state.markmapInstance.rescale();
            }
        });
    }

    // Initialize the application
    init();
});
