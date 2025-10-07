import html2canvas from 'html2canvas';

interface ScreenshotOptions {
  filename?: string;
  quality?: number;
  format?: 'png' | 'jpeg';
}

/**
 * Take a screenshot of an element and download it
 */
export async function downloadElementScreenshot(
  element: HTMLElement,
  options: ScreenshotOptions = {}
): Promise<void> {
  const {
    filename = 'brand-showcase.png',
    quality = 2,
    format = 'png'
  } = options;

  try {
    // Show simple loading state
    const loadingDiv = document.createElement('div');
    loadingDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        color: white;
        font-family: system-ui;
      ">
        <div style="text-align: center;">
          <div style="border: 3px solid #f3f3f3; border-top: 3px solid #ff6b35; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
          <div>Taking screenshot...</div>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    document.body.appendChild(loadingDiv);

    // Wait a moment for any animations to settle
    await new Promise(resolve => setTimeout(resolve, 500));

    // Capture the element with high quality
    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: element.offsetWidth * quality,
      height: element.offsetHeight * quality
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // Convert to blob
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, mimeType, format === 'jpeg' ? 0.9 : undefined);
    });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Remove loading div
    if (loadingDiv && loadingDiv.parentNode) {
      loadingDiv.parentNode.removeChild(loadingDiv);
    }

  } catch (error) {
    console.error('Error taking screenshot:', error);

    // Remove loading div if it exists
    const existingLoadingDiv = document.querySelector('[style*="position: fixed"]') as HTMLElement;
    if (existingLoadingDiv && existingLoadingDiv.parentNode) {
      existingLoadingDiv.parentNode.removeChild(existingLoadingDiv);
    }

    // Show error message
    alert('Failed to take screenshot. Please try again.');
    throw error;
  }
}

/**
 * Download Bento Grid as PNG screenshot
 */
export async function downloadBentoGridScreenshot(brandName?: string): Promise<void> {
  const bentoElement = document.querySelector('[data-bento-grid]') as HTMLElement;

  if (!bentoElement) {
    alert('Unable to find the brand showcase to download. Please make sure mockups are generated.');
    return;
  }

  const filename = brandName
    ? `${brandName.toLowerCase().replace(/\s+/g, '-')}-brand-showcase.png`
    : 'brand-showcase.png';

  await downloadElementScreenshot(bentoElement, {
    filename,
    quality: 2,
    format: 'png'
  });
}

/**
 * Download entire showcase section (including header)
 */
export async function downloadFullShowcaseScreenshot(brandName?: string): Promise<void> {
  const showcaseElement = document.querySelector('section.py-32') as HTMLElement;

  if (!showcaseElement) {
    alert('Unable to find the brand showcase to download.');
    return;
  }

  const filename = brandName
    ? `${brandName.toLowerCase().replace(/\s+/g, '-')}-full-showcase.png`
    : 'full-brand-showcase.png';

  await downloadElementScreenshot(showcaseElement, {
    filename,
    quality: 2,
    format: 'png'
  });
}