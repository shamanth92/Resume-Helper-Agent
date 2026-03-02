import { ResumeSchema, TailoredResumeSchema } from "../agent/state";
import * as z from "zod";
import { Document, AlignmentType, HeadingLevel, Paragraph, TextRun, convertInchesToTwip } from "docx";

export const buildResumeDocument = (tailoredResume: z.infer<typeof TailoredResumeSchema>,
    resumeData: z.infer<typeof ResumeSchema>) => {

    const children: Paragraph[] = [];

    // Header - Contact Information
    children.push(
        new Paragraph({
            text: resumeData.contact.name,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 }
        }),
        new Paragraph({
            text: `${resumeData.contact.location} | ${resumeData.contact.phone} | ${resumeData.contact.email}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
        })
    );

    // Professional Summary
    if (tailoredResume.summary) {
        children.push(
            new Paragraph({
                text: "PROFESSIONAL SUMMARY",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
                thematicBreak: true
            }),
            new Paragraph({
                text: tailoredResume.summary,
                spacing: { after: 200 }
            })
        );
    }

    // Skills Section
    if (tailoredResume.skills && tailoredResume.skills.length > 0) {
        children.push(
            new Paragraph({
                text: "SKILLS",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
                thematicBreak: true
            }),
            new Paragraph({
                text: tailoredResume.skills.join(" • "),
                spacing: { after: 200 }
            })
        );
    }

    // Professional Experience
    if (tailoredResume.experience && tailoredResume.experience.length > 0) {
        children.push(
            new Paragraph({
                text: "EXPERIENCE",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
                thematicBreak: true
            })
        );

        tailoredResume.experience.forEach((exp, index) => {
            // Job Title and Company
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: exp.title,
                            bold: true,
                            size: 24
                        })
                    ],
                    spacing: { before: index === 0 ? 0 : 150, after: 50 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: exp.company,
                            italics: true
                        }),
                        new TextRun({
                            text: ` | ${exp.duration}`,
                            italics: true
                        })
                    ],
                    spacing: { after: 100 }
                })
            );

            // Bullet points
            if (exp.bullets && exp.bullets.length > 0) {
                exp.bullets.forEach(bullet => {
                    children.push(
                        new Paragraph({
                            text: bullet,
                            bullet: { level: 0 },
                            spacing: { after: 50 }
                        })
                    );
                });
            }
        });
    }

    // Education Section
    if (tailoredResume.education && tailoredResume.education.length > 0) {
        children.push(
            new Paragraph({
                text: "EDUCATION",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
                thematicBreak: true
            })
        );

        tailoredResume.education.forEach(edu => {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: edu.degree,
                            bold: true
                        })
                    ],
                    spacing: { after: 50 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: edu.institution,
                            italics: true
                        }),
                        new TextRun({
                            text: edu.year ? ` | ${edu.year}` : '',
                            italics: true
                        })
                    ],
                    spacing: { after: 100 }
                })
            );
        });
    }

    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: convertInchesToTwip(0.5),
                            right: convertInchesToTwip(0.5),
                            bottom: convertInchesToTwip(0.5),
                            left: convertInchesToTwip(0.5)
                        }
                    }
                },
                children: children
            }
        ]
    });

    return doc;
}