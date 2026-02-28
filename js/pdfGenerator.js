document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations, obs) => {
        const downloadButton = document.getElementById('download-cv-btn');
        if (downloadButton) {
            obs.disconnect();
            
            downloadButton.addEventListener('click', async () => {
                downloadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                downloadButton.disabled = true;

                try {
                    const dataUrls = [
                        'data/profile.json',
                        'data/about.json',
                        'data/publications.json',
                        'data/contact.json'
                    ];

                    const responses = await Promise.all(dataUrls.map(url => fetch(url)));
                    const jsonData = await Promise.all(responses.map(res => {
                        if (!res.ok) throw new Error(`Failed to fetch ${res.url}: ${res.statusText}`);
                        return res.json();
                    }));

                    const cvData = {
                        profile: jsonData[0],
                        about: jsonData[1],
                        publications: jsonData[2],
                        contact: jsonData[3]
                    };

                    if (typeof window.jspdf === 'undefined') {
                        throw new Error('jsPDF library not loaded!');
                    }
                    const { jsPDF } = window.jspdf;
                    generatePdf(cvData, jsPDF);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    alert('Failed to generate PDF. Please check the console for details.');
                } finally {
                    downloadButton.innerHTML = '<i class="fas fa-download"></i>';
                    downloadButton.disabled = false;
                }
            });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});

function generatePdf(data, jsPDF) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    doc.setTextColor('#000000');
    
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - 2 * margin;
    let y = margin;

    // Helper to add text with wrapping
    function addText(text, size = 10, style = 'normal') {
        if (!text) return y;
        doc.setFont('helvetica', style);
        doc.setFontSize(size);
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach(line => {
            doc.text(line, margin, y);
            y += size * 0.35;
        });
        y += 2;
        return y;
    }

    // Name and title
    y = addText(data.profile.name, 22, 'bold');
    y = addText(data.profile.title, 14);
    y += 5;

    // Contact
    const contactText = data.profile.contactInfo.map(c => c.text).join(' • ');
    y = addText(contactText, 9);
    y += 5;

    // About
    if (data.about?.description) {
        y = addText(data.about.description, 10);
        y += 5;
    }

    // Research areas from services
    if (data.about?.services?.length) {
        y = addText('Research Areas', 12, 'bold');
        data.about.services.forEach(s => {
            y = addText(`• ${s.title}: ${s.description}`, 9);
        });
        y += 5;
    }

    // Publications
    const allPubs = [
        ...(data.publications.journalArticles || []),
        ...(data.publications.preprints || []),
        ...(data.publications.conferenceProceedings || [])
    ];
    if (allPubs.length) {
        y = addText('Publications', 12, 'bold');
        allPubs.forEach(pub => {
            y = addText(pub.title, 10, 'bold');
            y = addText(`${pub.authors} — ${pub.venue}`, 9);
            y += 2;
        });
    }

    doc.save('Aaron_Villanueva_CV.pdf');
}
