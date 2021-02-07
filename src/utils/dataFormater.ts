export function formatCandidate(candidate) {
  const result = { ...candidate };
  const educationTranslate = {
    undergraduate: '本科',
    master: '硕士',
    doctor: '博士',
    juniorCollege: '大专',
    highSchool: '高中',
    other: '其他',
  };

  result.education = educationTranslate[result.education];
  result.key = result.id;

  return result;
}
