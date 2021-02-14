import { Education } from '@/models/candidate';

export function formatCandidate(candidate) {
  const result = { ...candidate };
  const educationTranslate = {
    [Education.UNDERGRADUATE]: '本科',
    [Education.MASTER]: '硕士',
    [Education.DOCTOR]: '博士',
    [Education.JUNIOR_COLLEGE]: '大专',
    [Education.HIGH_SCHOOL]: '高中',
    [Education.OTHER]: '其他',
  };

  result.education = educationTranslate[result.education];
  result.id = result['_id'];
  result.key = result.id;

  return result;
}
