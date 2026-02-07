import ReactPDF from "@react-pdf/renderer";

import type { ApplicationState } from "@/types/application";
import { triggerDownload } from "@/lib/export/jsonExport";

const { Document, Page, Text, View, StyleSheet, pdf } = ReactPDF;

// ─── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1a365d",
    paddingBottom: 10,
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1a365d",
  },
  contactInfo: {
    fontSize: 9,
    color: "#4a5568",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#1a365d",
    marginTop: 16,
    marginBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#cbd5e0",
    paddingBottom: 3,
  },
  entryTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginTop: 6,
  },
  entrySubtitle: {
    fontSize: 9,
    color: "#718096",
    marginBottom: 2,
  },
  text: {
    fontSize: 10,
    marginBottom: 2,
  },
  bullet: {
    fontSize: 10,
    paddingLeft: 12,
    marginBottom: 1,
  },
  skillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 4,
  },
  skillBadge: {
    fontSize: 9,
    backgroundColor: "#edf2f7",
    padding: "3 8",
    borderRadius: 3,
  },
});

// ─── PDF Document ──────────────────────────────────────────
function ApplicationPdfDocument({ state }: { state: ApplicationState }) {
  const { personalData, workExperience, education, skills, languages } = state;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalData.firstName} {personalData.lastName}
          </Text>
          <Text style={styles.contactInfo}>
            {[
              personalData.email,
              personalData.phone,
              [personalData.address.street, personalData.address.zip, personalData.address.city]
                .filter(Boolean)
                .join(", "),
            ]
              .filter(Boolean)
              .join(" | ")}
          </Text>
        </View>

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Berufserfahrung</Text>
            {workExperience.map((exp) => (
              <View key={exp.id}>
                <Text style={styles.entryTitle}>
                  {exp.jobTitle} — {exp.company}
                </Text>
                <Text style={styles.entrySubtitle}>
                  {exp.startDate} – {exp.isCurrentJob ? "heute" : exp.endDate || "k.A."}
                  {exp.location ? ` | ${exp.location}` : ""}
                </Text>
                {exp.tasks.map((task, i) => (
                  <Text key={`task-${exp.id}-${i}`} style={styles.bullet}>
                    • {task}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Bildung</Text>
            {education.map((edu) => (
              <View key={edu.id}>
                <Text style={styles.entryTitle}>
                  {edu.degree || edu.type} — {edu.institution}
                </Text>
                <Text style={styles.entrySubtitle}>
                  {edu.startDate} – {edu.endDate || "heute"}
                  {edu.fieldOfStudy ? ` | ${edu.fieldOfStudy}` : ""}
                  {edu.grade ? ` | Note: ${edu.grade}` : ""}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Kenntnisse</Text>
            <View style={styles.skillRow}>
              {skills.map((skill) => (
                <Text key={skill.id} style={styles.skillBadge}>
                  {skill.name} ({"★".repeat(skill.level)})
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Sprachen</Text>
            {languages.map((lang) => (
              <Text key={lang.id} style={styles.text}>
                {lang.name} — {lang.level}
              </Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}

// ─── Public API ────────────────────────────────────────────

/**
 * Generate a PDF blob from the application state.
 */
export async function exportAsPdf(state: ApplicationState): Promise<Blob> {
  const doc = <ApplicationPdfDocument state={state} />;
  return await pdf(doc).toBlob();
}

/**
 * Generate PDF and trigger download.
 */
export async function downloadPdf(state: ApplicationState): Promise<void> {
  const blob = await exportAsPdf(state);
  const lastName = (state.personalData.lastName || "Bewerbung").replace(
    /[^a-zA-Z0-9äöüÄÖÜß_-]/g,
    "_",
  );
  const company = (state.jobPosting?.companyName || "Firma").replace(
    /[^a-zA-Z0-9äöüÄÖÜß_-]/g,
    "_",
  );
  const fileName = `Bewerbung_${lastName}_${company}.pdf`;
  triggerDownload(blob, fileName);
}
