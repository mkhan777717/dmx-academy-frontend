/**
 * Resolves problem tab content (Followup, Editorial, Solution, Evaluation)
 * from the database-loaded problem object.
 *
 * All content is authored by admins via the problem creation form.
 * There is no hardcoded data in this helper.
 */
export function getProblemTabs(slug, title, details = {}) {
  const cleanTitle = title || "Problem";

  return {
    description: details.desc || details.statement || `### Description\nNo description provided.`,
    followup:
      details.followup ||
      `### Followup\nNo follow-up questions have been added for this problem yet.`,
    editorial:
      details.editorial ||
      `### Editorial\nNo editorial has been published for this problem yet.`,
    solution:
      details.solution ||
      `### Solution\nNo official solution has been published for this problem yet.`,
    evaluation:
      details.evaluation ||
      `### Evaluation Limits\n* **Time Limit:** ${details.timeout || 2000}ms\n* **Memory Limit:** ${details.memoryLimit || 256}MB`,
  };
}
