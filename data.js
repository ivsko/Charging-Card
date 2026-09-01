// ==========================================
// ⚙️ БАЗА ДАННИ И КОНФИГУРАЦИЯ НА ЛЕЯРНАТА
// ==========================================

const TARGET_GRADES = {
  'gjs500': { name: 'EN-GJS-500', C: 3.750, Si: 1.20, Mn: 0.40, Cu: 0.40 },
  'gjl200': { name: 'EN-GJL-200', C: 3.30, Si: 2.00, Mn: 0.60, Cu: 0.30 },
  'gjs400': { name: 'EN-GJS-400', C: 3.80, Si: 1.25, Mn: 0.20, Cu: 0.1 },
  'gjl300': { name: 'EN-GJL-200', C: 3.10, Si: 1.8, Mn: 0.60, Cu: 0.30 },
  'gjs600': { name: 'EN-GJS-600', C: 3.750, Si: 1.20, Mn: 0.50, Cu: 0.40 },
  'gjs700': { name: 'EN-GJS-700', C: 3.750, Si: 1.20, Mn: 0.80, Cu: 0.9 }
};

// Всеки материал описва какво количество елементи (% от теглото му) вкарва в стопилката
const MATERIALS_DATA = {
 
  scrap:     { C: 0.30, Si: 0.30, Mn: 0.50, Cu: 0.10 }, // Стоманен скрап (нисък въглерод)
  returnGjs: { C: 3.5, Si: 2.4, Mn: 0.35, Cu: 0.35 }, // Собствен леяк GJS
  returnGjl: { C: 3.2, Si: 1.9, Mn: 0.60, Cu: 0.30 }, // Собствен леяк GJL
  pigIron:   { C: 4.5, Si: 0.6, Mn: 0.01, Cu: 0.00 }, // Нов чугун (тук слагаш реалния % на твоя чугун, напр. 4.3% или 4.5%)
  
  // Добавки с коефициент на усвояване (yield)
  carbonizer: { element: 'C', yield: 0.85, addsKgPerKg: 0.85 }, 
  fesi:       { element: 'Si', yield: 0.75, contentInFeSi: 0.75 }, 
  femn:       { element: 'Mn', yield: 0.70, contentInFeMn: 0.75 }, 
  copper:     { element: 'Cu', yield: 0.95 }
};
