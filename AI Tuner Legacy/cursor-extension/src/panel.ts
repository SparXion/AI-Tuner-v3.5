import * as vscode from 'vscode';

/**
 * AITunerPanel - Loads web version in iframe for single codebase
 * Currently using AITunerProvider's webview instead, but keeping this
 * as backup option if iframe approach is needed later
 */
export class AITunerPanel {
  public static currentPanel: AITunerPanel | undefined;

  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel) {
    this._panel = panel;
    this._panel.webview.html = this._getWebviewContent();
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public static createOrShow(_context: vscode.ExtensionContext) {
    const column = vscode.ViewColumn.Beside;
    if (AITunerPanel.currentPanel) {
      AITunerPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'aiTuner',
      'AI Tuner',
      column,
      { 
        enableScripts: true, 
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.parse('https://cdn.jsdelivr.net'),
          vscode.Uri.parse('https://unpkg.com'),
          vscode.Uri.parse('https://sparxion.github.io')
        ]
      }
    );

    AITunerPanel.currentPanel = new AITunerPanel(panel);
  }

  private _getWebviewContent(): string {
    // Load web version from GitHub Pages (single codebase approach)
    const webAppUrl = 'https://sparxion.github.io/AI-Tuner/';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; frame-src *; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline';">
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            font-family: var(--vscode-font-family);
            background: var(--vscode-editor-background);
        }
        iframe {
            width: 100%;
            height: 100vh;
            border: none;
        }
    </style>
</head>
<body>
    <iframe 
        src="${webAppUrl}" 
        allow="clipboard-read; clipboard-write"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals">
    </iframe>
    <script>
        const vscode = acquireVsCodeApi();
        
        // Listen for messages from iframe
        window.addEventListener('message', (event) => {
            if (event.origin === '${webAppUrl.replace(/\/$/, '')}') {
                if (event.data.command) {
                    vscode.postMessage(event.data);
                }
            }
        });
    </script>
</body>
</html>`;
  }

  public dispose() {
    AITunerPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const d = this._disposables.pop();
      if (d) d.dispose();
    }
  }
}

