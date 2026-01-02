// ============================================
// Skillytics Certificate Generation Service
// Generates PDF certificates for earned certifications
// ============================================

import PDFDocument from 'pdfkit';
import { db } from '@/lib/db';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

interface CertificateData {
  recipientName: string;
  certificationName: string;
  certificationType: string;
  description: string;
  issueDate: Date;
  expiryDate?: Date;
  certificateId: string;
  verificationUrl: string;
  score?: number;
}

export async function generateCertificate(
  userId: string,
  certificationId: string
): Promise<{ pdfPath: string; certificateHash: string } | null> {
  try {
    // Get user certification record
    const userCert = await db.userCertification.findUnique({
      where: {
        userId_certificationId: {
          userId,
          certificationId
        }
      },
      include: {
        user: { select: { name: true } },
        certification: true
      }
    });

    if (!userCert) {
      throw new Error('Certification not found');
    }

    const data: CertificateData = {
      recipientName: userCert.user.name || 'Learner',
      certificationName: userCert.certification.name,
      certificationType: userCert.certification.type,
      description: userCert.certification.description,
      issueDate: userCert.issueDate,
      expiryDate: userCert.expiryDate || undefined,
      certificateId: userCert.certificateHash,
      verificationUrl: userCert.verificationUrl || '',
      score: userCert.score || undefined
    };

    // Generate PDF
    const pdfBuffer = await createCertificatePDF(data);
    
    // Ensure certificates directory exists
    const certificatesDir = path.join(process.cwd(), 'public', 'certificates');
    await mkdir(certificatesDir, { recursive: true });

    // Save PDF
    const filename = `${userCert.certificateHash}.pdf`;
    const pdfPath = path.join(certificatesDir, filename);
    await writeFile(pdfPath, pdfBuffer);

    // Update record with PDF path
    await db.userCertification.update({
      where: { id: userCert.id },
      data: { pdfPath: `/certificates/${filename}` }
    });

    return {
      pdfPath: `/certificates/${filename}`,
      certificateHash: userCert.certificateHash
    };
  } catch (error) {
    console.error('Certificate generation error:', error);
    return null;
  }
}

async function createCertificatePDF(data: CertificateData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Background gradient effect (using rectangles)
      doc.rect(0, 0, doc.page.width, doc.page.height)
         .fill('#fafbfc');

      // Border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
         .lineWidth(3)
         .stroke('#2563eb');

      doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
         .lineWidth(1)
         .stroke('#93c5fd');

      // Header
      doc.fillColor('#1e40af')
         .font('Helvetica-Bold')
         .fontSize(42)
         .text('Skillytics', 0, 80, { align: 'center' });

      doc.fillColor('#64748b')
         .font('Helvetica')
         .fontSize(16)
         .text('CERTIFICATE OF ACHIEVEMENT', 0, 130, { align: 'center' });

      // Decorative line
      doc.moveTo(250, 160)
         .lineTo(doc.page.width - 250, 160)
         .lineWidth(2)
         .stroke('#2563eb');

      // "This is to certify that"
      doc.fillColor('#374151')
         .font('Helvetica')
         .fontSize(14)
         .text('This is to certify that', 0, 190, { align: 'center' });

      // Recipient name
      doc.fillColor('#1e3a8a')
         .font('Helvetica-Bold')
         .fontSize(36)
         .text(data.recipientName, 0, 220, { align: 'center' });

      // Decorative line under name
      doc.moveTo(200, 270)
         .lineTo(doc.page.width - 200, 270)
         .lineWidth(1)
         .stroke('#d1d5db');

      // Description
      doc.fillColor('#4b5563')
         .font('Helvetica')
         .fontSize(14)
         .text('has successfully completed the requirements for', 0, 300, { align: 'center' });

      // Certification name
      doc.fillColor('#2563eb')
         .font('Helvetica-Bold')
         .fontSize(28)
         .text(data.certificationName, 0, 330, { align: 'center' });

      // Certification type badge
      const badgeWidth = 300;
      const badgeHeight = 30;
      const badgeX = (doc.page.width - badgeWidth) / 2;
      const badgeY = 380;

      doc.rect(badgeX, badgeY, badgeWidth, badgeHeight)
         .fill('#dbeafe');

      doc.fillColor('#1e40af')
         .font('Helvetica-Bold')
         .fontSize(12)
         .text(data.certificationType.replace('_', ' ').toUpperCase(), 0, 388, { align: 'center' });

      // Score if available
      if (data.score !== undefined && data.score > 0) {
        doc.fillColor('#059669')
           .font('Helvetica')
           .fontSize(12)
           .text(`Score: ${Math.round(data.score)}%`, 0, 430, { align: 'center' });
      }

      // Date
      const dateStr = new Date(data.issueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      doc.fillColor('#374151')
         .font('Helvetica')
         .fontSize(12)
         .text(`Awarded on ${dateStr}`, 0, 470, { align: 'center' });

      // Expiry date if applicable
      if (data.expiryDate) {
        const expiryStr = new Date(data.expiryDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        doc.fillColor('#dc2626')
           .fontSize(10)
           .text(`Valid until ${expiryStr}`, 0, 490, { align: 'center' });
      }

      // Certificate ID and verification
      doc.fillColor('#9ca3af')
         .fontSize(8)
         .text(`Certificate ID: ${data.certificateId}`, 50, doc.page.height - 80);

      // QR Code placeholder (in real implementation, generate QR code)
      doc.fillColor('#000')
         .fontSize(8)
         .text(`Verify at: ${data.verificationUrl}`, 50, doc.page.height - 65);

      // Signature lines
      const signatureY = doc.page.height - 100;

      // Left signature
      doc.moveTo(100, signatureY)
         .lineTo(300, signatureY)
         .lineWidth(1)
         .stroke('#9ca3af');

      doc.fillColor('#374151')
         .fontSize(10)
         .text('Skillytics Director', 100, signatureY + 10, { width: 200, align: 'center' });

      // Right signature
      doc.moveTo(doc.page.width - 300, signatureY)
         .lineTo(doc.page.width - 100, signatureY)
         .lineWidth(1)
         .stroke('#9ca3af');

      doc.fillColor('#374151')
         .fontSize(10)
         .text('Chief Learning Officer', doc.page.width - 300, signatureY + 10, { width: 200, align: 'center' });

      // Finalize PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Generate certificate as data URL for preview
export async function generateCertificatePreview(
  userId: string,
  certificationId: string
): Promise<string | null> {
  try {
    const userCert = await db.userCertification.findUnique({
      where: {
        userId_certificationId: {
          userId,
          certificationId
        }
      },
      include: {
        user: { select: { name: true } },
        certification: true
      }
    });

    if (!userCert) {
      return null;
    }

    const data: CertificateData = {
      recipientName: userCert.user.name || 'Learner',
      certificationName: userCert.certification.name,
      certificationType: userCert.certification.type,
      description: userCert.certification.description,
      issueDate: userCert.issueDate,
      expiryDate: userCert.expiryDate || undefined,
      certificateId: userCert.certificateHash,
      verificationUrl: userCert.verificationUrl || '',
      score: userCert.score || undefined
    };

    const pdfBuffer = await createCertificatePDF(data);
    return `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Certificate preview error:', error);
    return null;
  }
}

// Download certificate
export async function downloadCertificate(certificateHash: string) {
  try {
    const userCert = await db.userCertification.findUnique({
      where: { certificateHash },
      include: {
        user: { select: { name: true } },
        certification: true
      }
    });

    if (!userCert) {
      throw new Error('Certificate not found');
    }

    // If PDF already generated, serve it
    if (userCert.pdfPath) {
      return {
        path: path.join(process.cwd(), 'public', userCert.pdfPath),
        filename: `${userCert.certification.name.replace(/\s+/g, '_')}_Certificate.pdf`
      };
    }

    // Generate on the fly
    const result = await generateCertificate(userCert.userId, userCert.certificationId);
    
    if (!result) {
      throw new Error('Failed to generate certificate');
    }

    return {
      path: path.join(process.cwd(), 'public', result.pdfPath),
      filename: `${userCert.certification.name.replace(/\s+/g, '_')}_Certificate.pdf`
    };
  } catch (error) {
    console.error('Certificate download error:', error);
    throw error;
  }
}
