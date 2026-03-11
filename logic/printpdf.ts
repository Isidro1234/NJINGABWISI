import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf'
export const printing_pdf = (content:any , name:string )=>{
   const currentelement = content?.current;
   if(!currentelement) return;
   const SCALE = 5;
   html2canvas(currentelement, { scale: SCALE,
    useCORS: true,
    allowTaint: true,
    scrollX: 0,
    scrollY: 0,
    backgroundColor: '#ffffff',
    imageTimeout: 0,       // no timeout for loading images
    logging: false,}).then((canvas)=>{
        const imgdata = canvas.toDataURL("image/png") ;
        const pdf = new jsPDF('p','mm','a4',true)
        const ph = pdf.internal.pageSize.getHeight();
        const pw = pdf.internal.pageSize.getWidth();
        const imgW = canvas.width;
        const imgH= canvas.height;
        const ratio = Math.min(pw / imgW , ph / imgH);
        const imgX = (pw - imgW * ratio) / 2;
        const imgY = (ph - imgH * ratio) / 2;
        pdf.addImage(
            imgdata,
            "PNG",
            imgX,
            imgY,
            imgW * ratio,
            imgH * ratio
        )
        pdf.save(`${name}_uip${new Date().toUTCString()}_.pdf`)
   })
}