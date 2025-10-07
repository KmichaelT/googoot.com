import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PdfOptions {
  filename?: string;
  quality?: number;
  format?: 'a4' | 'letter' | 'a3';
  orientation?: 'landscape' | 'portrait';
}

/**
 * Generate and download a PDF from a DOM element
 */
export async function generatePDF(
  element: HTMLElement,
  options: PdfOptions = {}
): Promise<void> {
  const {
    filename = 'brand-showcase.pdf',
    quality = 2,
    format = 'a4',
    orientation = 'landscape'
  } = options;

  try {
    // Show loading state (you can customize this)
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
          <div>Generating PDF...</div>
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

    // Capture the element as canvas with high quality
    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      width: element.scrollWidth * quality,
      height: element.scrollHeight * quality,
      onclone: (clonedDoc: Document) => {
        // Completely override all styles to avoid OKLCH and modern CSS
        const allElements = clonedDoc.querySelectorAll('*');

        // Remove all existing stylesheets
        const stylesheets = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
        stylesheets.forEach(sheet => sheet.remove());

        // Apply safe styles directly to elements
        allElements.forEach((element: Element) => {
          const htmlElement = element as HTMLElement;

          // Reset all computed styles to safe values
          htmlElement.style.cssText = '';

          // Apply basic styles based on classes
          const classList = Array.from(htmlElement.classList);

          // Background colors
          if (classList.some(cls => cls.includes('bg-black'))) {
            htmlElement.style.backgroundColor = 'rgb(0, 0, 0)';
          } else if (classList.some(cls => cls.includes('bg-white'))) {
            htmlElement.style.backgroundColor = 'rgb(255, 255, 255)';
          } else if (classList.some(cls => cls.includes('bg-') && (cls.includes('gray') || cls.includes('[')))) {
            htmlElement.style.backgroundColor = 'rgb(107, 107, 107)';
          }

          // Text colors
          if (classList.some(cls => cls.includes('text-white'))) {
            htmlElement.style.color = 'rgb(255, 255, 255)';
          } else if (classList.some(cls => cls.includes('text-black'))) {
            htmlElement.style.color = 'rgb(0, 0, 0)';
          } else {
            htmlElement.style.color = 'rgb(255, 255, 255)';
          }

          // Borders
          if (classList.some(cls => cls.includes('border'))) {
            if (classList.some(cls => cls.includes('border-white'))) {
              htmlElement.style.borderColor = 'rgb(255, 255, 255)';
            }
            if (classList.some(cls => cls.includes('border-0'))) {
              htmlElement.style.border = 'none';
            } else {
              htmlElement.style.borderWidth = '1px';
              htmlElement.style.borderStyle = 'solid';
            }
          }

          // Layout and positioning
          if (classList.some(cls => cls.includes('grid'))) {
            htmlElement.style.display = 'grid';
          }
          if (classList.some(cls => cls.includes('flex'))) {
            htmlElement.style.display = 'flex';
          }
          if (classList.some(cls => cls.includes('relative'))) {
            htmlElement.style.position = 'relative';
          }
          if (classList.some(cls => cls.includes('absolute'))) {
            htmlElement.style.position = 'absolute';
          }

          // Spacing
          if (classList.some(cls => cls.includes('p-'))) {
            const paddingClass = classList.find(cls => cls.startsWith('p-'));
            if (paddingClass === 'p-12') htmlElement.style.padding = '3rem';
            if (paddingClass === 'p-20') htmlElement.style.padding = '5rem';
          }

          // Sizing
          if (classList.some(cls => cls.includes('w-full'))) {
            htmlElement.style.width = '100%';
          }
          if (classList.some(cls => cls.includes('h-full'))) {
            htmlElement.style.height = '100%';
          }

          // Object fit
          if (classList.some(cls => cls.includes('object-contain'))) {
            htmlElement.style.objectFit = 'contain';
          }
          if (classList.some(cls => cls.includes('object-cover'))) {
            htmlElement.style.objectFit = 'cover';
          }

          // Rounded corners
          if (classList.some(cls => cls.includes('rounded'))) {
            htmlElement.style.borderRadius = '0.5rem';
          }
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // Calculate PDF dimensions
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // PDF page dimensions in mm
    const pageWidth = format === 'a4' ? (orientation === 'landscape' ? 297 : 210) :
                     format === 'letter' ? (orientation === 'landscape' ? 279 : 216) :
                     (orientation === 'landscape' ? 420 : 297); // a3

    const pageHeight = format === 'a4' ? (orientation === 'landscape' ? 210 : 297) :
                      format === 'letter' ? (orientation === 'landscape' ? 216 : 279) :
                      (orientation === 'landscape' ? 297 : 420); // a3

    // Calculate scaling to fit content while maintaining aspect ratio
    const imgAspectRatio = imgWidth / imgHeight;
    const pageAspectRatio = pageWidth / pageHeight;

    let finalWidth, finalHeight;

    if (imgAspectRatio > pageAspectRatio) {
      // Image is wider relative to page - fit to width
      finalWidth = pageWidth - 20; // 10mm margin on each side
      finalHeight = finalWidth / imgAspectRatio;
    } else {
      // Image is taller relative to page - fit to height
      finalHeight = pageHeight - 20; // 10mm margin on top/bottom
      finalWidth = finalHeight * imgAspectRatio;
    }

    // Center the image on the page
    const x = (pageWidth - finalWidth) / 2;
    const y = (pageHeight - finalHeight) / 2;

    // Create PDF
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format
    });

    // Add the canvas as an image to the PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

    // Add metadata
    pdf.setProperties({
      title: 'Brand Showcase',
      subject: 'Generated brand mockups and style guide',
      author: 'Googoot Brand Generator',
      creator: 'Googoot.com'
    });

    // Save the PDF
    pdf.save(filename);

    // Remove loading div safely
    if (loadingDiv && loadingDiv.parentNode) {
      loadingDiv.parentNode.removeChild(loadingDiv);
    }

  } catch (error) {
    console.error('Error generating PDF:', error);

    // Remove loading div if it exists
    const existingLoadingDiv = document.querySelector('[style*="position: fixed"]') as HTMLElement;
    if (existingLoadingDiv && existingLoadingDiv.parentNode) {
      existingLoadingDiv.parentNode.removeChild(existingLoadingDiv);
    }

    // Show error message
    alert('Failed to generate PDF. Please try again.');
    throw error;
  }
}

/**
 * Generate PDF specifically for the Bento Grid showcase
 */
export async function downloadBentoGridPDF(brandName?: string): Promise<void> {
  const bentoElement = document.querySelector('[data-bento-grid]') as HTMLElement;

  if (!bentoElement) {
    alert('Unable to find the brand showcase to download. Please make sure mockups are generated.');
    return;
  }

  const filename = brandName
    ? `${brandName.toLowerCase().replace(/\s+/g, '-')}-brand-showcase.pdf`
    : 'brand-showcase.pdf';

  await generatePDF(bentoElement, {
    filename,
    quality: 2,
    format: 'a4',
    orientation: 'landscape'
  });
}