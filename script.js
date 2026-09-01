document.addEventListener('DOMContentLoaded', () => {
  const furnaceBtns = document.querySelectorAll('.furnace-btn');
  const targetMeltWeight = document.getElementById('targetMeltWeight');
  const targetWeightDisplay = document.getElementById('targetWeightDisplay');
  const targetGradeSelect = document.getElementById('targetGrade');
  const swampGradeSelect = document.getElementById('swampGrade'); // Падащо меню за марката на блатото
  
  const swampWeightInput = document.getElementById('swampWeight');
  const tableSwampText = document.getElementById('tableSwampText');
  
  const totalWeightDisplay = document.getElementById('totalWeightDisplay');
  const scaleStatus = document.getElementById('scaleStatus');
  const calculateBtn = document.getElementById('calculateBtn');
  const clearAllBtn = document.getElementById('clearAllBtn');

  const scrapInput = document.getElementById('scrapWeightInput');
  const returnGjsInput = document.getElementById('returnGjsWeight');
  const returnGjlInput = document.getElementById('returnGjlWeight');
  const pigIronInput = document.getElementById('pigIronWeight');
  const cInput = document.getElementById('cWeightInput');
  const fesiInput = document.getElementById('fesiWeightInput');
  const femnInput = document.getElementById('femnWeightInput');
  const cuInput = document.getElementById('cuWeightInput');

  const valC = document.getElementById('valC');
  const valSi = document.getElementById('valSi');
  const valMn = document.getElementById('valMn');
  const valCu = document.getElementById('valCu');

  const targetC = document.getElementById('targetC');
  const targetSi = document.getElementById('targetSi');
  const targetMn = document.getElementById('targetMn');
  const targetCu = document.getElementById('targetCu');

  const operatorAdvice = document.getElementById('operatorAdvice');

  const pctSwamp = document.getElementById('pctSwamp');
  const pctScrap = document.getElementById('pctScrap');
  const pctReturnGjs = document.getElementById('pctReturnGjs');
  const pctReturnGjl = document.getElementById('pctReturnGjl');
  const pctPigIron = document.getElementById('pctPigIron');
  const pctC = document.getElementById('pctC');
  const pctFeSi = document.getElementById('pctFeSi');
  const pctFeMn = document.getElementById('pctFeMn');
  const pctCu = document.getElementById('pctCu');

  // Масив с всички полета за въвеждане на тегла
  const allInputs = [
    swampWeightInput, scrapInput, returnGjsInput, returnGjlInput, 
    pigIronInput, cInput, fesiInput, femnInput, cuInput
  ];

  // 1. ИЗБОР НА ПЕЩ
  furnaceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      furnaceBtns.forEach(b => b.classList.remove('active-furnace'));
      btn.classList.add('active-furnace');
      const capacity = btn.getAttribute('data-capacity');
      targetMeltWeight.value = capacity;
      targetWeightDisplay.textContent = capacity;
      updateScaleDynamic();
    });
  });

  // 2. СМЯНА НА ЦЕЛЕВА МАРКА
  targetGradeSelect.addEventListener('change', () => {
    updateTargetsDisplay();
  });

  function updateTargetsDisplay() {
    const grade = targetGradeSelect.value;
    const targets = TARGET_GRADES[grade] || TARGET_GRADES['gjs500'];
    
    targetC.textContent = `Цел: ${targets.C.toFixed(2)}%`;
    targetSi.textContent = `Цел: ${targets.Si.toFixed(2)}%`;
    targetMn.textContent = `Цел: ${targets.Mn.toFixed(2)}%`;
    targetCu.textContent = `Цел: ${targets.Cu.toFixed(2)}%`;
  }

  // 3. ДИНАМИЧЕН КАНТАР (Работи в реално време при писане)
  function updateScaleDynamic() {
    const targetW = parseFloat(targetMeltWeight.value) || 10000;
    
    const swampW = parseFloat(swampWeightInput.value) || 0;
    const scrapW = parseFloat(scrapInput.value) || 0;
    const retGjsW = parseFloat(returnGjsInput.value) || 0;
    const retGjlW = parseFloat(returnGjlInput.value) || 0;
    const pigW = parseFloat(pigIronInput.value) || 0;
    const cW = parseFloat(cInput.value) || 0;
    const fesiW = parseFloat(fesiInput.value) || 0;
    const femnW = parseFloat(femnWeightInput.value) || 0;
    const cuW = parseFloat(cuInput.value) || 0;

    const totalW = swampW + scrapW + retGjsW + retGjlW + pigW + cW + fesiW + femnW + cuW;
    totalWeightDisplay.textContent = totalW;
    tableSwampText.textContent = swampW; // Пренася теглото на блатото в таблицата

    function getPct(val) {
      return totalW > 0 ? ((val / totalW) * 100).toFixed(1) + '%' : '0.0%';
    }

    pctSwamp.textContent = getPct(swampW);
    pctScrap.textContent = getPct(scrapW);
    pctReturnGjs.textContent = getPct(retGjsW);
    pctReturnGjl.textContent = getPct(retGjlW);
    pctPigIron.textContent = getPct(pigW);
    pctC.textContent = getPct(cW);
    pctFeSi.textContent = getPct(fesiW);
    pctFeMn.textContent = getPct(femnW);
    pctCu.textContent = getPct(cuW);

    const diff = totalW - targetW;
    scaleStatus.className = 'scale-status';
    
    if (Math.abs(diff) <= 500 && totalW > 0) {
      scaleStatus.classList.add('in-tolerance');
      scaleStatus.textContent = `⚖️ КАНТАР: Перфектно тегло!`;
    } else if (totalW < targetW - 500) {
      scaleStatus.classList.add('under-weight');
      scaleStatus.textContent = `⚖️ КАНТАР: Недостатъчно тегло! Добавете още ${targetW - totalW} kg.`;
    } else if (totalW > targetW + 500) {
      scaleStatus.classList.add('over-weight');
      scaleStatus.textContent = `⚖️ КАНТАР: Превишено тегло! Намалете с ${totalW - targetW} kg.`;
    } else {
      scaleStatus.classList.add('under-weight');
      scaleStatus.textContent = `⚖️ КАНТАР: Заредете материали...`;
    }
  }

  allInputs.forEach(input => {
    input.addEventListener('input', updateScaleDynamic);
  });

  // 4. БУТОН ЗА ИЗЧИСТВАНЕ
  clearAllBtn.addEventListener('click', () => {
    scrapInput.value = 0;
    returnGjsInput.value = 0;
    returnGjlInput.value = 0;
    pigIronInput.value = 0;
    cInput.value = 0;
    fesiInput.value = 0;
    femnInput.value = 0;
    cuInput.value = 0;
    
    updateScaleDynamic();
    
    valC.textContent = "0.00%";
    valSi.textContent = "0.00%";
    valMn.textContent = "0.00%";
    valCu.textContent = "0.00%";
    
    operatorAdvice.textContent = 'Нагласете теглата и натиснете бутона "Изчисли Химичен Състав".';
  });

  // 5. ИЗЧИСЛЯВАНЕ НА ХИМИЯТА (САМО ПРИ КЛИК НА БУТОНА)
  calculateBtn.addEventListener('click', () => {
    const totalW = parseFloat(totalWeightDisplay.textContent) || 0;

    if (totalW === 0) {
      valC.textContent = "0.00%";
      valSi.textContent = "0.00%";
      valMn.textContent = "0.00%";
      valCu.textContent = "0.00%";
      operatorAdvice.textContent = 'Моля, въведете тегла и натиснете бутона.';
      return;
    }

    const swampW = parseFloat(swampWeightInput.value) || 0;
    const scrapW = parseFloat(scrapInput.value) || 0;
    const retGjsW = parseFloat(returnGjsInput.value) || 0;
    const retGjlW = parseFloat(returnGjlInput.value) || 0;
    const pigW = parseFloat(pigIronInput.value) || 0;
    const cW = parseFloat(cInput.value) || 0;
    const fesiW = parseFloat(fesiInput.value) || 0;
    const femnW = parseFloat(femnWeightInput.value) || 0;
    const cuW = parseFloat(cuInput.value) || 0;

    // Взимаме състава на блатото директно от избраното падащо меню (swampGrade)
    const swampGradeVal = swampGradeSelect.value;
    const swampComposition = TARGET_GRADES[swampGradeVal] || TARGET_GRADES['gjs500'];

    // 🔬 РЕАЛЕН МАСОВ БАЛАНС (КГ ЕЛЕМЕНТ / ОБЩО КГ В ПЕЩТА)
    let totalCKg = (swampW * swampComposition.C / 100) + 
                   (scrapW * MATERIALS_DATA.scrap.C / 100) + 
                   (retGjsW * MATERIALS_DATA.returnGjs.C / 100) + 
                   (retGjlW * MATERIALS_DATA.returnGjl.C / 100) + 
                   (pigW * MATERIALS_DATA.pigIron.C / 100) + 
                   (cW * MATERIALS_DATA.carbonizer.yield); 

    let totalSiKg = (swampW * swampComposition.Si / 100) + 
                    (scrapW * MATERIALS_DATA.scrap.Si / 100) + 
                    (retGjsW * MATERIALS_DATA.returnGjs.Si / 100) + 
                    (retGjlW * MATERIALS_DATA.returnGjl.Si / 100) + 
                    (pigW * MATERIALS_DATA.pigIron.Si / 100) + 
                    (fesiW * 0.75 * MATERIALS_DATA.fesi.yield); 

    let totalMnKg = (swampW * swampComposition.Mn / 100) + 
                    (scrapW * MATERIALS_DATA.scrap.Mn / 100) + 
                    (retGjsW * MATERIALS_DATA.returnGjs.Mn / 100) + 
                    (retGjlW * MATERIALS_DATA.returnGjl.Mn / 100) + 
                    (pigW * MATERIALS_DATA.pigIron.Mn / 100) + 
                    (femnW * 0.75 * MATERIALS_DATA.femn.yield); 

    let totalCuKg = (swampW * swampComposition.Cu / 100) + 
                    (scrapW * MATERIALS_DATA.scrap.Cu / 100) + 
                    (retGjsW * MATERIALS_DATA.returnGjs.Cu / 100) + 
                    (retGjlW * MATERIALS_DATA.returnGjl.Cu / 100) + 
                    (pigW * MATERIALS_DATA.pigIron.Cu / 100) + 
                    (cuW * MATERIALS_DATA.copper.yield);

    let calcC = (totalCKg / totalW) * 100;
    let calcSi = (totalSiKg / totalW) * 100;
    let calcMn = (totalMnKg / totalW) * 100;
    let calcCu = (totalCuKg / totalW) * 100;

    valC.textContent = calcC.toFixed(2) + '%';
    valSi.textContent = calcSi.toFixed(2) + '%';
    valMn.textContent = calcMn.toFixed(2) + '%';
    valCu.textContent = calcCu.toFixed(2) + '%';

    const currentGrade = targetGradeSelect.value;
    const targets = TARGET_GRADES[currentGrade];

    updateChemCardStyle(valC, calcC, targets.C, 0.08);
    updateChemCardStyle(valSi, calcSi, targets.Si, 0.10);
    updateChemCardStyle(valMn, calcMn, targets.Mn, 0.05);
    updateChemCardStyle(valCu, calcCu, targets.Cu, 0.05);

    generateAdvice(calcC, calcSi, calcMn, targets, totalW);
  });

  function updateChemCardStyle(element, current, target, tolerance) {
    element.className = 'chem-val';
    if (current === 0) return;

    const diff = current - target;
    if (Math.abs(diff) <= tolerance) {
      element.classList.add('val-green');
    } else if (diff > tolerance) {
      element.classList.add('val-red');
    } else {
      element.classList.add('val-amber');
    }
  }

  function generateAdvice(c, si, mn, targets, totalW) {
    let adviceText = '';
    if (c < targets.C - 0.08) {
      let neededC = ((targets.C - c) * 100).toFixed(1);
      adviceText = `⚠️ Въглеродът е нисък! Подсказка: Добавете около ${Math.round(neededC * 1.2)} kg Навъглеродител (C).`;
    } else if (si < targets.Si - 0.10) {
      let neededSi = ((targets.Si - si) * 100).toFixed(1);
      adviceText = `⚠️ Силицият е нисък! Подсказка: Добавете около ${Math.round(neededSi * 1.5)} kg Феросилиций (FeSi75).`;
    } else if (mn < targets.Mn - 0.05) {
      let neededMn = ((targets.Mn - mn) * 100).toFixed(1);
      adviceText = `⚠️ Манганът е нисък! Подсказка: Добавете около ${Math.round(neededMn * 1.8)} kg Фероманган (FeMn75).`;
    } else {
      adviceText = '✅ Химичният състав е в норма! Шихтата е готова за разтопяване.';
    }

    operatorAdvice.textContent = adviceText;
  }

  // Първоначална инициализация при зареждане на страницата
  updateTargetsDisplay();
  updateScaleDynamic(); 
});
