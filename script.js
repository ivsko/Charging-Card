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

  const pctSwamp = document.getElementById('pctSwamp');
  const pctScrap = document.getElementById('pctScrap');
  const pctReturnGjs = document.getElementById('pctReturnGjs');
  const pctReturnGjl = document.getElementById('pctReturnGjl');
  const pctPigIron = document.getElementById('pctPigIron');
  const pctC = document.getElementById('pctC');
  const pctFeSi = document.getElementById('pctFeSi');
  const pctFeMn = document.getElementById('pctFeMn');
  const pctCu = document.getElementById('pctCu');

  const allInputs = [
    swampWeightInput, scrapInput, returnGjsInput, returnGjlInput, 
    pigIronInput, cInput, fesiInput, femnInput, cuInput
  ];

  // Променлива за съхранение на името на избраната пещ
  let selectedFurnaceName = "Пещ 1";

  // Автоматично изчистване на 0 при клик и връщане на 0 при празно поле
  allInputs.forEach(input => {
    input.addEventListener('focus', function() {
      if (this.value === '0') {
        this.value = '';
      }
    });

    input.addEventListener('blur', function() {
      if (this.value.trim() === '') {
        this.value = '0';
        updateScaleDynamic(); 
      }
    });
  });

  // Показване/скриване на полетата за ръчен състав на блатото
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
      
      // Записваме точния текст/име от бутона (напр. "Пещ 1 (10 т)")
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

  // Функция за взимане на активния състав на блатото
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
    swampWeightInput.value = 0;
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

  // 5. ИЗЧИСЛЯВАНЕ НА ХИМИЯТА
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

  // 6. ПРИНТИРАНЕ НА ОТЧЕТ
 
  if (printReportBtn) {
    printReportBtn.addEventListener('click', () => {
      const furnaceCapacity = targetMeltWeight.value || '10000';
      const targetGradeName = targetGradeSelect.options[targetGradeSelect.selectedIndex].text;
      const swampGradeName = useCustomSwampCheckbox && useCustomSwampCheckbox.checked 
        ? 'Ръчно въведен състав' 
        : swampGradeSelect.options[swampGradeSelect.selectedIndex].text;
      
      const swampComp = getActiveSwampComposition();

      // Генериране на текуща дата и час
      const now = new Date();
      const dateTimeStr = now.toLocaleDateString('bg-BG') + ' в ' + now.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' });

      const currentC = parseFloat(valC.textContent) || 0;
      const currentSi = parseFloat(valSi.textContent) || 0;
      const currentMn = parseFloat(valMn.textContent) || 0;
      const currentGradeKey = targetGradeSelect.value;
      const targetObj = TARGET_GRADES[currentGradeKey] || TARGET_GRADES['gjs500'];
      const totalW = parseFloat(totalWeightDisplay.textContent) || 0;

      let recC = parseFloat(cInput.value) || 0;
      let recSi = parseFloat(fesiInput.value) || 0;
      let recMn = parseFloat(femnInput.value) || 0;

      if (recC === 0 && currentC < targetObj.C - 0.08 && totalW > 0) {
        recC = Math.round(((targetObj.C - currentC) * totalW / 100) * 1.2);
      }
      if (recSi === 0 && currentSi < targetObj.Si - 0.10 && totalW > 0) {
        recSi = Math.round(((targetObj.Si - currentSi) * totalW / 100) * 1.5);
      }
      if (recMn === 0 && currentMn < targetObj.Mn - 0.05 && totalW > 0) {
        recMn = Math.round(((targetObj.Mn - currentMn) * totalW / 100) * 1.8);
      }

      // Филтриране само на материалите с тегло > 0
      let materialsRowsHTML = '';
      
      
      
      
      const scrapW = parseFloat(scrapInput.value) || 0;
      if (scrapW > 0) {
        materialsRowsHTML += `<tr><td>Стоманен скрап</td><td>${scrapW} kg</td></tr>`;
      }
      
      const retGjsW = parseFloat(returnGjsInput.value) || 0;
      if (retGjsW > 0) {
        materialsRowsHTML += `<tr><td>Собствен възврат - Сферографитен чугун ВЧ (GJS)</td><td>${retGjsW} kg</td></tr>`;
      }
      
      const retGjlW = parseFloat(returnGjlInput.value) || 0;
      if (retGjlW > 0) {
        materialsRowsHTML += `<tr><td>Собствен възврат - Сив чугун СЧ (GJL)</td><td>${retGjlW} kg</td></tr>`;
      }
      
      const pigW = parseFloat(pigIronInput.value) || 0;
      if (pigW > 0) {
        materialsRowsHTML += `<tr><td>Нов чугун</td><td>${pigW} kg</td></tr>`;
      }

      // Филтриране само на коректорите с тегло > 0 или препоръка > 0
      let additivesRowsHTML = '';
      
      const cW = parseFloat(cInput.value) || 0;
      if (cW > 0 || recC > 0) {
        const valToPrint = cW > 0 ? cW + ' kg' : recC + ' kg ';
        additivesRowsHTML += `<tr><td>Навъглеродител (C)</td><td>${valToPrint}</td></tr>`;
      }
      
      const fesiW = parseFloat(fesiInput.value) || 0;
      if (fesiW > 0 || recSi > 0) {
        const valToPrint = fesiW > 0 ? fesiW + ' kg' : recSi + ' kg ';
        additivesRowsHTML += `<tr><td>Феросилиций (FeSi75)</td><td>${valToPrint}</td></tr>`;
      }
      
      const femnW = parseFloat(femnWeightInput.value) || 0;
      if (femnW > 0 || recMn > 0) {
        const valToPrint = femnW > 0 ? femnW + ' kg' : recMn + ' kg ';
        additivesRowsHTML += `<tr><td>Фероманган (FeMn75)</td><td>${valToPrint}</td></tr>`;
      }
      
      const cuW = parseFloat(cuInput.value) || 0;
      if (cuW > 0) {
        additivesRowsHTML += `<tr><td>Мед (Cu)</td><td>${cuW} kg</td></tr>`;
      }

      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Шихтова карта - Прогрес</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; color: #333;}
              h2 { 
                border-bottom: 2px solid #333; 
                padding-bottom: 8px; 
                text-align: center; 
                font-size: 26px; 
              }
              table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; }
              th, td { border: 1px solid #ccc; padding: 8px 8px; text-align: left;font-size: 16px; }
              th { background: #eee; }
            </style>
          </head>
          <body>
          <img src="bg.png" alt="Лого на фирмата" style="max-height: 60px; width: auto;" />
            <h2>ПРОИЗВОДСТВЕН ОТЧЕТ - ШИХТОВА КАРТА</h2>
            
            <p style="text-align: right; font-size: 14px; color: #555; margin-bottom: 15px;"><strong></strong> ${dateTimeStr}</p>
            
            <p style="text-align: center; font-size: 17px;"><strong>Избрана пещ:</strong> <span style="font-size: 25px; font-weight: bold;">${selectedFurnaceName}</span> (${furnaceCapacity} kg)</p>
            
            <p style="text-align: center; font-size: 17px;"><strong>Марка чугун:</strong> <span style="font-size: 25px; font-weight: bold;">${targetGradeName}</span> </p>
            
           
            
            ${materialsRowsHTML !== '' ? `
              <h3>Влагане на основни материали:</h3>
              <table>
                <tr><th>Материал</th><th>Въведено тегло (kg)</th></tr>
                ${materialsRowsHTML}
              </table>
            ` : ''}

            ${additivesRowsHTML !== '' ? `
              <h3>Влагане на коректори и добавки:</h3>
              <table>
                <tr><th>Коректор</th><th>Въведено / Изчислено тегло (kg)</th></tr>
                ${additivesRowsHTML}
              </table>
            ` : ''}

            

            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    });
  }

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

  updateTargetsDisplay();
  
  if (furnaceBtns.length > 0) {
    furnaceBtns[0].click();
  }
});
