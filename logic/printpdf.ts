import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export const printing_pdf = async (content: any, name: string) => {
    const currentelement = content?.current
    if (!currentelement) return

    // ✅ Force element to desktop-like width before capture
    const originalWidth = currentelement.style.width
    const originalTransform = currentelement.style.transform
    currentelement.style.width = '800px'
    currentelement.style.transform = 'none'

    // ✅ Wait for fonts and images to load
    await document.fonts.ready

    const SCALE = 2  // lower scale on mobile — 5 is too heavy

    try {
        const canvas = await html2canvas(currentelement, {
            scale: SCALE,
            useCORS: true,
            allowTaint: true,
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
            backgroundColor: '#ffffff',
            imageTimeout: 15000,       // ✅ give images time to load
            logging: false,
            // ✅ Force full element size
            width: currentelement.scrollWidth,
            height: currentelement.scrollHeight,
            windowWidth: 800,          // ✅ simulate desktop width
            windowHeight: currentelement.scrollHeight,
            onclone: (clonedDoc) => {
                // ✅ Fix elements that disappear — force visibility on clone
                const clonedElement = clonedDoc.body
                clonedElement.style.fontFamily = 'Arial, sans-serif'
                
                // Force all images to be visible
                clonedDoc.querySelectorAll('img').forEach((img: HTMLImageElement) => {
                    img.style.display = 'block'
                    img.crossOrigin = 'anonymous'
                })

                // Force all hidden elements to show
                clonedDoc.querySelectorAll('[style*="display: none"]').forEach((el: any) => {
                    el.style.display = 'block'
                })
            }
        })

        // ✅ Restore original styles
        currentelement.style.width = originalWidth
        currentelement.style.transform = originalTransform

        const imgdata = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm', 'a4', true)
        const ph = pdf.internal.pageSize.getHeight()
        const pw = pdf.internal.pageSize.getWidth()

        const imgW = canvas.width / SCALE   // ✅ divide by scale to get real size
        const imgH = canvas.height / SCALE

        const ratio = Math.min(pw / imgW, ph / imgH)
        const imgX = (pw - imgW * ratio) / 2
        const imgY = 10  // ✅ small top margin instead of centering vertically

        // ✅ Handle multi-page if content is long
        const totalPages = Math.ceil((imgH * ratio) / ph)

        if (totalPages <= 1) {
            pdf.addImage(imgdata, 'PNG', imgX, imgY, imgW * ratio, imgH * ratio)
        } else {
            // Multi-page support
            for (let i = 0; i < totalPages; i++) {
                if (i > 0) pdf.addPage()
                pdf.addImage(
                    imgdata,
                    'PNG',
                    imgX,
                    imgY - (i * ph),
                    imgW * ratio,
                    imgH * ratio
                )
            }
        }

        pdf.save(`${name}_uip_${new Date().toISOString()}.pdf`)

    } catch (error) {
        console.error('PDF generation error:', error)
        // ✅ Always restore styles even on error
        currentelement.style.width = originalWidth
        currentelement.style.transform = originalTransform
    }
}