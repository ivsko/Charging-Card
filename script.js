document.addEventListener('DOMContentLoaded', () => {
  const furnaceBtns = document.querySelectorAll('.furnace-btn');
  const targetMeltWeight = document.getElementById('targetMeltWeight');
  const targetWeightDisplay = document.getElementById('targetWeightDisplay');
  const targetGradeSelect = document.getElementById('targetGrade');
  const swampGradeSelect = document.getElementById('swampGrade'); 
  
  // Елементи за персонализирано блато
  const toggleCustomSwampBtn = document.getElementById('toggleCustomSwampBtn');
  const customSwampContainer = document.getElementById('customSwampContainer');
  const useCustomSwampCheckbox = document.getElementById('useCustomSwamp');
  const customSwampC = document.getElementById('customSwampC');
  const customSwampSi = document.getElementById('customSwampSi');
  const customSwampMn = document.getElementById('customSwampMn');
  const customSwampCu = document.getElementById('customSwampCu');

  // Бутон за принтиране
  const printReportBtn = document.getElementById('printReportBtn');
  
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
  const adviceBoxContainer = operatorAdvice.closest('.advice-box');

  const pctSwamp = document.getElementById('pctSwamp');
  const pctScrap = document.getElementById('pctScrap');
  const pctReturnGjs = document.getElementById('pctReturnGjs');
  const pctReturnGjl = document.getElementById('pctReturnGjl');
  const pctPigIron = document.getElementById('pctPigIron');
  const pctC = document.getElementById('pctC');
  const pctFeSi = document.getElementById('pctFeSi');
  const pctFeMn = document.getElementById('pctFeMn');
  const pctCu = document.getElementById('pctCu');

  const labCInput = document.getElementById('labC');
  const labSiInput = document.getElementById('labSi');
  const labMnInput = document.getElementById('labMn');
  const labCuInput = document.getElementById('labCu');
  const calcCorrectionBtn = document.getElementById('calcCorrectionBtn');

  const allInputs = [
    swampWeightInput, scrapInput, returnGjsInput, returnGjlInput, 
    pigIronInput, cInput, fesiInput, femnInput, cuInput
  ];

  const labInputs = [labCInput, labSiInput, labMnInput, labCuInput];

  let selectedFurnaceName = "Пещ 1";

  // Универсална функция за оцветяване: 
  // Зелено = в норма, Жълто = под целта, Червено = над целта
  function updateChemCardStyle(element, currentVal, targetVal, tolerance) {
    if (!element) return;
    const card = element.closest('.chem-card') || element.parentElement;
    
    element.classList.remove('text-success', 'text-danger', 'text-warning');
    if (card) {
      card.style.borderColor = '';
      card.style.backgroundColor = '';
    }

    const diff = currentVal - targetVal;
    
    if (Math.abs(diff) <= tolerance) {
      // 🟢 В норма (Зелено)
      element.style.color = '#34d399';
      if (card) {
        card.style.borderColor = '#34d399';
        card.style.backgroundColor = 'rgba(52, 211, 153, 0.05)';
      }
    } else if (diff < -tolerance) {
      // 🟡 Под целта (Жълто)
      element.style.color = '#fbbf24';
      if (card) {
        card.style.borderColor = '#fbbf24';
        card.style.backgroundColor = 'rgba(251, 191, 36, 0.05)';
      }
    } else {
      // 🔴 Над целта (Червено)
      element.style.color = '#f87171';
      if (card) {
        card.style.borderColor = '#f87171';
        card.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
      }
    }
  }

  function setupInputFocusBlur(inputsArray) {
    inputsArray.forEach(input => {
      if (input) {
        input.addEventListener('focus', function() {
          if (this.value === '0') {
            this.value = '';
          }
        });

        input.addEventListener('blur', function() {
          if (this.value.trim() === '') {
            this.value = '0';
            if (inputsArray === allInputs) {
              updateScaleDynamic();
            }
          }
        });
      }
    });
  }

  setupInputFocusBlur(allInputs);
  setupInputFocusBlur(labInputs);

  if (toggleCustomSwampBtn && customSwampContainer) {
    toggleCustomSwampBtn.addEventListener('click', () => {
      if (customSwampContainer.style.display === 'none') {
        customSwampContainer.style.display = 'block';
        toggleCustomSwampBtn.textContent = '⚙️ Скрий промяната на блатото';
      } else {
        customSwampContainer.style.display = 'none';
        toggleCustomSwampBtn.textContent = '⚙️ Промени състава на блатото';
      }
    });
  }

  // 1. ИЗБОР НА ПЕЩ
  furnaceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      furnaceBtns.forEach(b => b.classList.remove('active-furnace'));
      btn.classList.add('active-furnace');
      const capacity = btn.getAttribute('data-capacity');
      targetMeltWeight.value = capacity;
      targetWeightDisplay.textContent = capacity;
      selectedFurnaceName = btn.textContent.trim();
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

  function getActiveSwampComposition() {
    if (useCustomSwampCheckbox && useCustomSwampCheckbox.checked) {
      return {
        C: parseFloat(customSwampC.value) || 0,
        Si: parseFloat(customSwampSi.value) || 0,
        Mn: parseFloat(customSwampMn.value) || 0,
        Cu: parseFloat(customSwampCu.value) || 0
      };
    } else {
      const swampGradeVal = swampGradeSelect.value;
      return TARGET_GRADES[swampGradeVal] || TARGET_GRADES['gjs500'];
    }
  }

  // 3. ДИНАМИЧЕН КАНТАР
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
    tableSwampText.textContent = swampW; 

    function getPct(val) {
      return targetW > 0 ? ((val / targetW) * 100).toFixed(1) + '%' : '0.0%';
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
    const tolerance = targetW * 0.05;

    scaleStatus.className = 'scale-status';
    
    if (Math.abs(diff) <= tolerance && totalW > 0) {
      scaleStatus.classList.add('in-tolerance');
      scaleStatus.textContent = `⚖️ КАНТАР: Перфектно тегло!`;
    } else if (totalW < targetW - tolerance) {
      scaleStatus.classList.add('under-weight');
      scaleStatus.textContent = `⚖️ КАНТАР: Недостатъчно тегло! Добавете още ${Math.round(targetW - totalW)} kg.`;
    } else if (totalW > targetW + tolerance) {
      scaleStatus.classList.add('over-weight');
      scaleStatus.textContent = `⚖️ КАНТАР: Превишено тегло! Намалете с ${Math.round(totalW - targetW)} kg.`;
    } else {
      scaleStatus.classList.add('under-weight');
      scaleStatus.textContent = `⚖️ КАНТАР: Заредете материали...`;
    }
  }

  allInputs.forEach(input => {
    input.addEventListener('input', updateScaleDynamic);
  });

  if (useCustomSwampCheckbox) {
    useCustomSwampCheckbox.addEventListener('change', updateScaleDynamic);
  }

  // 4. БУТОН ЗА ИЗЧИСТВАНЕ
  clearAllBtn.addEventListener('click', () => {
    allInputs.forEach(input => input.value = 0);
    updateScaleDynamic();
    
    valC.textContent = "0.00%";
    valSi.textContent = "0.00%";
    valMn.textContent = "0.00%";
    valCu.textContent = "0.00%";

    [valC, valSi, valMn, valCu].forEach(el => {
      el.style.color = '';
      const card = el.closest('.chem-card') || el.parentElement;
      if (card) {
        card.style.borderColor = '';
        card.style.backgroundColor = '';
      }
    });
    
    if (adviceBoxContainer) {
      adviceBoxContainer.style.backgroundColor = '';
      adviceBoxContainer.style.borderColor = '';
      adviceBoxContainer.style.minHeight = '';
    }
    operatorAdvice.style.color = '';
    operatorAdvice.style.fontSize = '';
    operatorAdvice.style.fontWeight = '';
    operatorAdvice.innerHTML = 'Нагласете теглата и натиснете бутона "Изчисли Химичен Състав".';
  });

  // 5. ИЗЧИСЛЯВАНЕ НА ХИМИЯТА
  calculateBtn.addEventListener('click', () => {
    const totalW = parseFloat(totalWeightDisplay.textContent) || 0;

    if (totalW === 0) {
      valC.textContent = "0.00%";
      valSi.textContent = "0.00%";
      valMn.textContent = "0.00%";
      valCu.textContent = "0.00%";
      operatorAdvice.innerHTML = 'Моля, въведете тегла и натиснете бутона.';
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

    const swampComposition = getActiveSwampComposition();

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
                    (fesiW * MATERIALS_DATA.fesi.contentInFeSi * MATERIALS_DATA.fesi.yield); 

    let totalMnKg = (swampW * swampComposition.Mn / 100) + 
                    (scrapW * MATERIALS_DATA.scrap.Mn / 100) + 
                    (retGjsW * MATERIALS_DATA.returnGjs.Mn / 100) + 
                    (retGjlW * MATERIALS_DATA.returnGjl.Mn / 100) + 
                    (pigW * MATERIALS_DATA.pigIron.Mn / 100) + 
                    (femnW * MATERIALS_DATA.femn.contentInFeMn * MATERIALS_DATA.femn.yield); 

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

 // 6. ПРИНТИРАНЕ НА ОТЧЕТ (Само въведени материали, реални добавки и корекция на пещ)
 if (printReportBtn) {
  printReportBtn.addEventListener('click', () => {
    const furnaceCapacity = targetMeltWeight.value || '10000';
    const targetGradeName = targetGradeSelect.options[targetGradeSelect.selectedIndex].text;
    
    const now = new Date();
    const dateTimeStr = now.toLocaleDateString('bg-BG') + ' в ' + now.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' });

    // Събиране на основни материали
    let materialsRowsHTML = '';
    const scrapW = parseFloat(scrapInput.value) || 0;
    if (scrapW > 0) materialsRowsHTML += `<tr><td>Стоманен скрап</td><td>${scrapW} kg</td></tr>`;
    
    const retGjsW = parseFloat(returnGjsInput.value) || 0;
    if (retGjsW > 0) materialsRowsHTML += `<tr><td>Собствен възврат - Сферографитен чугун ВЧ (GJS)</td><td>${retGjsW} kg</td></tr>`;
    
    const retGjlW = parseFloat(returnGjlInput.value) || 0;
    if (retGjlW > 0) materialsRowsHTML += `<tr><td>Собствен възврат - Сив чугун СЧ (GJL)</td><td>${retGjlW} kg</td></tr>`;
    
    const pigW = parseFloat(pigIronInput.value) || 0;
    if (pigW > 0) materialsRowsHTML += `<tr><td>Нов чугун</td><td>${pigW} kg</td></tr>`;

    // Събиране само на реално въведените от оператора коректори/добавки (БЕЗ автоматични сметки)
    let additivesRowsHTML = '';
    const cW = parseFloat(cInput.value) || 0;
    if (cW > 0) additivesRowsHTML += `<tr><td>Навъглеродител (C)</td><td>${cW} kg</td></tr>`;
    
    const fesiW = parseFloat(fesiInput.value) || 0;
    if (fesiW > 0) additivesRowsHTML += `<tr><td>Феросилиций (FeSi75)</td><td>${fesiW} kg</td></tr>`;
    
    const femnW = parseFloat(femnWeightInput.value) || 0;
    if (femnW > 0) additivesRowsHTML += `<tr><td>Фероманган (FeMn75)</td><td>${femnW} kg</td></tr>`;
    
    const cuW = parseFloat(cuInput.value) || 0;
    if (cuW > 0) additivesRowsHTML += `<tr><td>Мед (Cu)</td><td>${cuW} kg</td></tr>`;

    // Лабораторни корекции (Корекция на пещ) - появяват се само при въведени лаб. данни
    let labCorrectionRowsHTML = '';
    const labC = parseFloat(labCInput.value) || 0;
    const labSi = parseFloat(labSiInput.value) || 0;
    const labMn = parseFloat(labMnInput.value) || 0;
    const labCu = parseFloat(labCuInput.value) || 0;
    const targetW = parseFloat(targetMeltWeight.value) || 0;
    const currentGradeKey = targetGradeSelect.value;
    const targetObj = TARGET_GRADES[currentGradeKey] || TARGET_GRADES['gjs500'];

    if ((labC > 0 || labSi > 0 || labMn > 0 || labCu > 0) && targetW > 0) {
      const corrC = targetObj.C - labC;
      if (corrC > 0.05) {
        const kg = Math.round((((corrC / 100) * targetW) / MATERIALS_DATA.carbonizer.yield) * 0.8);
        if (kg > 0) labCorrectionRowsHTML += `<tr><td>Навъглеродител (C)</td><td>${kg} kg</td></tr>`;
      }

      const corrSi = targetObj.Si - labSi;
      if (corrSi > 0.05) {
        const effectiveSiYield = MATERIALS_DATA.fesi.yield * MATERIALS_DATA.fesi.contentInFeSi;
        const kg = Math.round((((corrSi / 100) * targetW) / effectiveSiYield) * 0.8);
        if (kg > 0) labCorrectionRowsHTML += `<tr><td>Феросилиций (FeSi75)</td><td>${kg} kg</td></tr>`;
      }

      const corrMn = targetObj.Mn - labMn;
      if (corrMn > 0.05) {
        const effectiveMnYield = MATERIALS_DATA.femn.yield * MATERIALS_DATA.femn.contentInFeMn;
        const kg = Math.round((((corrMn / 100) * targetW) / effectiveMnYield) * 0.8);
        if (kg > 0) labCorrectionRowsHTML += `<tr><td>Фероманган (FeMn75)</td><td>${kg} kg</td></tr>`;
      }

      const corrCu = targetObj.Cu - labCu;
      if (corrCu > 0.03) {
        const kg = Math.round((((corrCu / 100) * targetW) / MATERIALS_DATA.copper.yield) * 0.8);
        if (kg > 0) labCorrectionRowsHTML += `<tr><td>Мед (Cu)</td><td>${kg} kg</td></tr>`;
      }
    }

    let labSectionHTML = '';
    if (labCorrectionRowsHTML !== '') {
      labSectionHTML = `
        <h3 style="margin-top: 30px; margin-bottom: 10px;">Корекция на пещ</h3>
        <table>
          <tr><th>Коректор</th><th>Необходимо тегло (kg)</th></tr>
          ${labCorrectionRowsHTML}
        </table>
      `;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Шихтова карта - Прогрес</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333;}
            table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; font-size: 16px; }
            th { background: #eee; }
          </style>
        </head>
        <body>
          <table style="width: 100%; border: none; margin-bottom: 20px; border-collapse: collapse; border-bottom: 2px solid #333; padding-bottom: 10px;">
            <tr>
              <td style="border: none; width: 1%; white-space: nowrap; padding: 0 0 10px 0; vertical-align: middle;">
                <img src="" alt="Лого" style="max-height: 45px; width: auto; display: block;" />
              </td>
              <td style="border: none; text-align: left; padding: 0 0 10px 15px; vertical-align: middle;">
                <h2 style="margin: 0; border: none; padding: 0; font-size: 25px;">ПРОИЗВОДСТВЕН ОТЧЕТ - ШИХТОВА КАРТА</h2>
              </td>
            </tr>
          </table>
          <p style="text-align: right; font-size: 14px; color: #555; margin-bottom: 15px;">${dateTimeStr}</p>
          <p style="text-align: center; font-size: 17px;"><strong>Избрана пещ:</strong> <span style="font-size: 22px; font-weight: bold;">${selectedFurnaceName}</span> (${furnaceCapacity} kg)</p>
          <p style="text-align: center; font-size: 17px;"><strong>Марка чугун:</strong> <span style="font-size: 22px; font-weight: bold;">${targetGradeName}</span> </p>
          
          ${materialsRowsHTML !== '' ? `
            <h3 style="margin-top: 20px; margin-bottom: 10px;">Влагане на основни материали:</h3>
            <table>
              <tr><th>Материал</th><th>Въведено тегло (kg)</th></tr>
              ${materialsRowsHTML}
            </table>
          ` : ''}

          ${additivesRowsHTML !== '' ? `
            <h3 style="margin-top: 20px; margin-bottom: 10px;">Влагане на коректори и добавки:</h3>
            <table>
              <tr><th>Коректор</th><th>Въведено тегло (kg)</th></tr>
              ${additivesRowsHTML}
            </table>
          ` : ''}

          ${labSectionHTML}

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  });
}
  // 7. ЛАБОРАТОРНИ КОРЕКЦИИ (Използва целевото тегло на пещта, за да работи по всяко време)
  if (calcCorrectionBtn) {
    calcCorrectionBtn.addEventListener('click', () => {
      const targetW = parseFloat(targetMeltWeight.value) || 0;
      if (targetW <= 0) {
        alert('Моля, изберете пещ или въведете целево тегло!');
        return;
      }

      const labC = parseFloat(labCInput.value) || 0;
      const labSi = parseFloat(labSiInput.value) || 0;
      const labMn = parseFloat(labMnInput.value) || 0;
      const labCu = parseFloat(labCuInput.value) || 0;

      const currentGrade = targetGradeSelect.value;
      const targets = TARGET_GRADES[currentGrade];

      let correctionAdvice = [];

      const missingC_pct = targets.C - labC;
      if (missingC_pct > 0.05) {
        const missingCKg = (missingC_pct / 100) * targetW;
        const safeC = Math.round((missingCKg / MATERIALS_DATA.carbonizer.yield) * 0.8);
        if (safeC > 0) {
          correctionAdvice.push(`⚠️ Добавете ${safeC} kg Навъглеродител.`);
        }
      }

      const missingSi_pct = targets.Si - labSi;
      if (missingSi_pct > 0.05) {
        const missingSiKg = (missingSi_pct / 100) * targetW;
        const effectiveSiYield = MATERIALS_DATA.fesi.yield * MATERIALS_DATA.fesi.contentInFeSi;
        const safeSi = Math.round((missingSiKg / effectiveSiYield) * 0.8);
        if (safeSi > 0) {
          correctionAdvice.push(`⚠️ Добавете ${safeSi} kg Феросилиций (FeSi75).`);
        }
      }

      const missingMn_pct = targets.Mn - labMn;
      if (missingMn_pct > 0.05) {
        const missingMnKg = (missingMn_pct / 100) * targetW;
        const effectiveMnYield = MATERIALS_DATA.femn.yield * MATERIALS_DATA.femn.contentInFeMn;
        const safeMn = Math.round((missingMnKg / effectiveMnYield) * 0.8);
        if (safeMn > 0) {
          correctionAdvice.push(`⚠️Добавете ${safeMn} kg Фероманган (FeMn75).`);
        }
      }

      const missingCu_pct = targets.Cu - labCu;
      if (missingCu_pct > 0.03) {
        const missingCuKg = (missingCu_pct / 100) * targetW;
        const safeCu = Math.round((missingCuKg / MATERIALS_DATA.copper.yield) * 0.8);
        if (safeCu > 0) {
          correctionAdvice.push(`⚠️Добавете ${safeCu} kg Мед (Cu).`);
        }
      }

      operatorAdvice.innerHTML = '';

      if (correctionAdvice.length === 0) {
        if (adviceBoxContainer) {
          adviceBoxContainer.style.backgroundColor = 'rgba(16, 185, 129, 0.12)';
          adviceBoxContainer.style.borderColor = '#34d399';
          adviceBoxContainer.style.minHeight = '60px';
        }
        operatorAdvice.style.color = '#34d399';
        operatorAdvice.style.fontSize = '15px';
        operatorAdvice.style.fontWeight = '700';
        
        const p = document.createElement('div');
        p.textContent = '✅ Лабораторният анализ е перфектен! Няма нужда от корекции.';
        operatorAdvice.appendChild(p);
      } else {
        if (adviceBoxContainer) {
          adviceBoxContainer.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
          adviceBoxContainer.style.borderColor = '#f87171';
          adviceBoxContainer.style.minHeight = (correctionAdvice.length * 45 + 30) + 'px';
        }
        
        operatorAdvice.style.color = '#f87171';
        operatorAdvice.style.fontSize = '16px';
        operatorAdvice.style.fontWeight = '800';

        correctionAdvice.forEach(adviceText => {
          const rowDiv = document.createElement('div');
          rowDiv.style.marginBottom = '8px';
          rowDiv.textContent = adviceText;
          operatorAdvice.appendChild(rowDiv);
        });
      }
    });
  }

  function generateAdvice(c, si, mn, targets, totalW) {
    let adviceList = [];
    const totalWeight = parseFloat(totalWeightDisplay.textContent) || 0;

    if (totalWeight > 0) {
      const missingC_pct = targets.C - c;
      if (missingC_pct > 0.08) {
        const missingCKg = (missingC_pct / 100) * totalWeight;
        const theoreticalC = missingCKg / MATERIALS_DATA.carbonizer.yield;
        const safeC = Math.round(theoreticalC * 0.8);
        if (safeC > 0) {
          adviceList.push(`⚠️ Добавете около ${safeC} kg Навъглеродител.`);
        }
      }

      const missingSi_pct = targets.Si - si;
      if (missingSi_pct > 0.10) {
        const missingSiKg = (missingSi_pct / 100) * totalWeight;
        const effectiveSiYield = MATERIALS_DATA.fesi.yield * MATERIALS_DATA.fesi.contentInFeSi;
        const theoreticalSi = missingSiKg / effectiveSiYield;
        const safeSi = Math.round(theoreticalSi * 0.8);
        if (safeSi > 0) {
          adviceList.push(`⚠️ Добавете около ${safeSi} kg Феросилиций (FeSi75).`);
        }
      }

      const missingMn_pct = targets.Mn - mn;
      if (missingMn_pct > 0.05) {
        const missingMnKg = (missingMn_pct / 100) * totalWeight;
        const effectiveMnYield = MATERIALS_DATA.femn.yield * MATERIALS_DATA.femn.contentInFeMn;
        const theoreticalMn = missingMnKg / effectiveMnYield;
        const safeMn = Math.round(theoreticalMn * 0.8);
        if (safeMn > 0) {
          adviceList.push(`⚠️ Добавете около ${safeMn} kg Фероманган (FeMn75).`);
        }
      }
    }

    operatorAdvice.innerHTML = '';

    if (adviceList.length === 0) {
      if (adviceBoxContainer) {
        adviceBoxContainer.style.backgroundColor = 'rgba(16, 185, 129, 0.12)';
        adviceBoxContainer.style.borderColor = '#34d399';
        adviceBoxContainer.style.minHeight = '60px';
      }
      operatorAdvice.style.color = '#34d399';
      operatorAdvice.style.fontSize = '15px';
      operatorAdvice.style.fontWeight = '700';
      
      const p = document.createElement('div');
      p.textContent = '✅ Химичният състав е в норма! Шихтата е готова за разтопяване.';
      operatorAdvice.appendChild(p);
    } else {
      if (adviceBoxContainer) {
        adviceBoxContainer.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
        adviceBoxContainer.style.borderColor = '#f87171';
        adviceBoxContainer.style.minHeight = (adviceList.length * 45 + 30) + 'px';
      }
      
      operatorAdvice.style.color = '#f87171';
      operatorAdvice.style.fontSize = '16px';
      operatorAdvice.style.fontWeight = '800';

      adviceList.forEach(adviceText => {
        const rowDiv = document.createElement('div');
        rowDiv.style.marginBottom = '8px';
        rowDiv.textContent = adviceText;
        operatorAdvice.appendChild(rowDiv);
      });
    }
  }

  updateTargetsDisplay();
  
  if (furnaceBtns.length > 0) {
    furnaceBtns[0].click();
  }
});
