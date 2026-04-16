
import { jsPDF } from 'jspdf'

/**
 * Generates a professional Health Analysis PDF report.
 * @param {Object} data - The disease data object from API
 * @param {string} originalQuery - The raw symptom query searched by user
 */
export const generateHealthReport = (data, originalQuery) => {
  if (!data) return
  
  try {
    const doc = new jsPDF()
    const margin = 20
    let y = 30
    const pageHeight = doc.internal.pageSize.height

    const checkPage = (h) => {
      if (y + h > pageHeight - 20) {
        doc.addPage()
        y = 30
        return true
      }
      return false
    }

    // ── 1. HEADER ──
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.setTextColor(14, 165, 233)
    doc.text('HealthIQ (Health Analysis Tool)', margin, y)
    y += 10
    
    doc.setFontSize(16)
    doc.setTextColor(30, 41, 59)
    doc.text('Health Analysis Report', margin, y)
    y += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100)
    doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, margin, y)
    y += 8
    doc.text(`Condition Analyzed: "${data.disease_name || originalQuery}"`, margin, y)
    y += 15

    // Divider
    doc.setDrawColor(226, 232, 240)
    doc.line(margin, y, 190, y)
    y += 15

    // ── 2. SYMPTOMS ──
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(30, 41, 59)
    doc.text('SYMPTOMS:', margin, y)
    y += 8
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(71, 85, 105)
    ;(data.symptoms || []).forEach(s => {
      checkPage(6)
      doc.text(`• ${s.name}: ${s.description}`, margin + 5, y)
      y += 6
    })
    y += 10

    // ── 3. PREDICTIONS (Overview) ──
    checkPage(30)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(30, 41, 59)
    doc.text('ANALYSIS & OVERVIEW:', margin, y)
    y += 8
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(71, 85, 105)
    const overviewLines = doc.splitTextToSize(data.overview || 'No overview available.', 170)
    doc.text(overviewLines, margin + 5, y)
    y += (overviewLines.length * 5) + 10

    // ── 4. MEDICINES ──
    if (data.medicines?.length > 0) {
      checkPage(30)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor(30, 41, 59)
      doc.text('MEDICINES:', margin, y)
      y += 8
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      data.medicines.forEach(m => {
        checkPage(15)
        doc.setFont('helvetica', 'bold')
        doc.text(`• ${m.name} (${m.type})`, margin + 5, y)
        y += 5
        doc.setFont('helvetica', 'normal')
        doc.text(`  Purpose: ${m.purpose}`, margin + 5, y)
        y += 5
        if (m.note) {
          doc.setTextColor(185, 28, 28)
          doc.text(`  Note: ${m.note}`, margin + 5, y)
          doc.setTextColor(71, 85, 105)
          y += 5
        }
      })
      y += 10
    }

    // ── 5. DO / DON'T ──
    checkPage(30)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(22, 163, 74)
    doc.text('DO LIST:', margin, y)
    y += 8
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(71, 85, 105)
    ;(data.what_to_do || []).forEach(item => {
      checkPage(6)
      doc.text(`• ${item}`, margin + 5, y)
      y += 6
    })
    y += 8

    checkPage(30)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(185, 28, 28)
    doc.text("DON'T LIST:", margin, y)
    y += 8
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(71, 85, 105)
    ;(data.what_not_to_do || []).forEach(item => {
      checkPage(6)
      doc.text(`• ${item}`, margin + 5, y)
      y += 6
    })
    y += 10

    // ── 6. DIET ──
    checkPage(40)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(30, 41, 59)
    doc.text('DIETARY GUIDELINES:', margin, y)
    y += 8
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('What to Eat:', margin + 5, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    ;(data.food_to_eat || []).forEach(f => {
      checkPage(6)
      doc.text(`• ${f.food}: ${f.reason}`, margin + 10, y)
      y += 6
    })
    y += 4
    checkPage(20)
    doc.setFont('helvetica', 'bold')
    doc.text('What to Avoid:', margin + 5, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    ;(data.food_to_avoid || []).forEach(f => {
      checkPage(6)
      doc.text(`• ${f.food}: ${f.reason}`, margin + 10, y)
      y += 6
    })
    y += 10

    // ── 7. RECOVERY ──
    checkPage(30)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(124, 58, 237)
    doc.text('HOME RECOVERY TIPS:', margin, y)
    y += 8
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(71, 85, 105)
    ;(data.home_remedies || []).forEach(r => {
      checkPage(12)
      const wrapped = doc.splitTextToSize(`• ${r.remedy}: ${r.how_to_use}`, 165)
      doc.text(wrapped, margin + 5, y)
      y += (wrapped.length * 5) + 2
    })
    y += 10

    // ── 8. SEVERITY ──
    checkPage(30)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(30, 41, 59)
    doc.text('SEVERITY & TIMELINE:', margin, y)
    y += 8
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`• Mild Recovery: ${data.recovery_timeline?.mild_case || 'N/A'}`, margin + 5, y)
    y += 6
    doc.text(`• Moderate Recovery: ${data.recovery_timeline?.moderate_case || 'N/A'}`, margin + 5, y)
    y += 6
    doc.text(`• Severe Recovery: ${data.recovery_timeline?.severe_case || 'N/A'}`, margin + 5, y)
    y += 12

    // ── 9. DISCLAIMER ──
    checkPage(30)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9)
    doc.setTextColor(150)
    const discLines = doc.splitTextToSize(`DISCLAIMER: ${data.disclaimer || 'Consult a doctor immediately.'}`, 170)
    doc.text(discLines, margin, y)

    doc.save(`${(data.disease_name || 'Health').replace(/\s+/g, '_')}_Report.pdf`)
  } catch (err) {
    console.error('PDF Generation failed:', err)
    alert("Error generating report. Please try again.")
  }
}
