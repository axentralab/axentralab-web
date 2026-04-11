const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const proposalsDir = path.join(__dirname, '../uploads/proposals');

// Ensure directory exists
if (!fs.existsSync(proposalsDir)) {
  fs.mkdirSync(proposalsDir, { recursive: true });
}

/**
 * Generate Professional Proposal PDF
 */
exports.generateProposalPDF = async (lead, quoteEstimate, proposal) => {
  return new Promise((resolve, reject) => {
    const filename = `${lead._id}-${uuidv4()}.pdf`;
    const filepath = path.join(proposalsDir, filename);

    const doc = new PDFDocument({
      size: 'A4',
      margin: 40,
    });

    const writeStream = fs.createWriteStream(filepath);
    doc.pipe(writeStream);

    // Header with logo/company name
    doc.fontSize(24).font('Helvetica-Bold').text('AXENTRALAB', { align: 'left' });
    doc.fontSize(10).font('Helvetica').text('Digital Agency', { align: 'left' });
    doc.moveDown(0.5);

    doc.fontSize(12).font('Helvetica-Bold').text('PROJECT PROPOSAL', { align: 'center', underline: true });
    doc.fontSize(9).font('Helvetica').text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(1);

    // Client Information
    doc.fontSize(11).font('Helvetica-Bold').text('TO:', { underline: true });
    doc.fontSize(10).font('Helvetica').text(`${lead.name}`);
    if (lead.company) doc.text(`${lead.company}`);
    doc.text(`${lead.email}`);
    doc.moveDown(1);

    // Project Overview
    doc.fontSize(11).font('Helvetica-Bold').text('PROJECT OVERVIEW', { underline: true });
    doc.fontSize(10).font('Helvetica').text(`Service: ${lead.service || 'Custom Development'}`, { width: 465 });
    doc.text(`Request Date: ${new Date(lead.createdAt).toLocaleDateString()}`, { width: 465 });
    doc.moveDown(0.5);

    // Executive Summary
    doc.fontSize(11).font('Helvetica-Bold').text('EXECUTIVE SUMMARY', { underline: true });
    const summary = generateSummary(lead, quoteEstimate);
    doc.fontSize(9).font('Helvetica').text(summary, { align: 'justify', width: 465 });
    doc.moveDown(1);

    // Proposed Solution
    doc.fontSize(11).font('Helvetica-Bold').text('PROPOSED SOLUTION', { underline: true });
    doc.fontSize(9).font('Helvetica').text(lead.message || 'See requirements below', {
      align: 'justify',
      width: 465,
    });
    doc.moveDown(1);

    // Technology Stack
    doc.fontSize(11).font('Helvetica-Bold').text('TECHNOLOGY STACK', { underline: true });
    const techStack = quoteEstimate.recommendedTechStack || ['React', 'Node.js', 'MongoDB'];
    doc.fontSize(9).font('Helvetica').text(techStack.join(' • '));
    doc.moveDown(1);

    // Project Timeline
    doc.fontSize(11).font('Helvetica-Bold').text('PROJECT TIMELINE', { underline: true });
    if (quoteEstimate.phases && Array.isArray(quoteEstimate.phases)) {
      quoteEstimate.phases.forEach((phase, index) => {
        doc.fontSize(9).font('Helvetica').text(`Phase ${index + 1}: ${phase}`);
      });
    } else {
      doc.fontSize(9).font('Helvetica').text(`Duration: ${quoteEstimate.timeline}`);
    }
    doc.moveDown(1);

    // Investment/Pricing
    doc.fontSize(11).font('Helvetica-Bold').text('INVESTMENT', { underline: true });
    doc.fontSize(10).font('Helvetica-Bold').text(quoteEstimate.estimatedCost || '$Contact for quote');

    if (quoteEstimate.costBreakdown) {
      doc.fontSize(9).font('Helvetica');
      Object.entries(quoteEstimate.costBreakdown).forEach(([item, cost]) => {
        doc.text(`${capitalize(item)}: ${cost}`, { indent: 20 });
      });
    }
    doc.moveDown(1);

    // Security & Compliance
    doc.fontSize(11).font('Helvetica-Bold').text('SECURITY & COMPLIANCE', { underline: true });
    const security = quoteEstimate.securityMeasures || ['SSL/TLS Encryption', 'Data Protection', 'Regular Backups'];
    doc.fontSize(9).font('Helvetica');
    security.forEach(measure => {
      doc.text(`• ${measure}`);
    });
    doc.moveDown(1);

    // Deliverables
    doc.fontSize(11).font('Helvetica-Bold').text('KEY DELIVERABLES', { underline: true });
    const deliverables = generateDeliverables(quoteEstimate);
    doc.fontSize(9).font('Helvetica');
    deliverables.forEach(deliverable => {
      doc.text(`• ${deliverable}`);
    });
    doc.moveDown(1);

    // Next Steps
    doc.fontSize(11).font('Helvetica-Bold').text('NEXT STEPS', { underline: true });
    doc.fontSize(9).font('Helvetica').text(`
1. Review this proposal
2. Schedule kickoff meeting (15 mins)
3. Sign project agreement
4. Begin development phase

Contact us at: contact@axentralab.com`, { width: 465 });

    // Footer
    doc.moveDown(2);
    doc.fontSize(8).font('Helvetica').text('Axentralab - Digital Agency', { align: 'center' });
    doc.text('This proposal is valid for 30 days from the date above.', { align: 'center' });

    doc.end();

    writeStream.on('finish', () => {
      resolve({
        filename,
        filepath,
        url: `/api/proposals/download/${filename}`,
      });
    });

    writeStream.on('error', reject);
    doc.on('error', reject);
  });
};

/**
 * Generate summary based on requirements
 */
function generateSummary(lead, quote) {
  return `Based on your requirements for a ${lead.service}, we propose a solution leveraging modern, scalable technologies. The estimated timeline is ${quote.timeline || '4-8 weeks'}, with a total investment of ${quote.estimatedCost || 'custom'}. Our team will follow an agile development approach with regular checkpoints and transparent communication.`;
}

/**
 * Generate deliverable list
 */
function generateDeliverables(quote) {
  const deliverables = [];

  if (quote.recommendedTechStack?.includes('React') || quote.recommendedTechStack?.includes('Node.js')) {
    deliverables.push('Fully functional web application');
    deliverables.push('Responsive design for all devices');
  }

  deliverables.push('Complete source code documentation');
  deliverables.push('Database architecture design');

  if (quote.securityMeasures?.length > 0) {
    deliverables.push('Security audit and recommendations');
  }

  deliverables.push('Deployment to production');
  deliverables.push('Post-launch support (30 days)');
  deliverables.push('Training and documentation');

  return deliverables;
}

/**
 * Capitalize string
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get proposal file path
 */
exports.getProposalPath = (filename) => {
  return path.join(proposalsDir, filename);
};

/**
 * Check if proposal exists
 */
exports.proposalExists = (filename) => {
  return fs.existsSync(path.join(proposalsDir, filename));
};

/**
 * Delete proposal
 */
exports.deleteProposal = (filename) => {
  const filepath = path.join(proposalsDir, filename);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
    return true;
  }
  return false;
};

module.exports = exports;
