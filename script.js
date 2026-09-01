document.addEventListener('DOMContentLoaded', () => {
  const gradesDB = {
    gjs500: { name: 'EN-GJS-500-7', c: 3.60, si: 2.50, mn: 0.40, cu: 0.50 },
    gjl200: { name: 'EN-GJL-200',     c: 3.30, si: 2.10, mn: 0.60, cu: 0.20 },
    gjs400: { name: 'EN-GJS-400-15',  c: 3.70, si: 2.60, mn: 0.20, cu: 0.00 }
  };

  const furnaceBtns = document.querySelectorAll('.furnace-btn');
  const targetWeightInput = document.getElementById('targetWeight');
  const targetGradeSelect = document.getElementById('targetGrade');
  const swampGradeSelect = document.getElementById('swampGrade');
  const swampWeightInput = document.getElementById('swampWeight');
  const pigIronInput = document.getElementById('pigIronWeight');
  const matInputs = document.querySelectorAll('.mat-input');
  const matPctDisplays = document.querySelectorAll('.mat-pct');

  const valC = document.getElementById('valC');
  const valSi = document.getElementById('valSi');
  const valMn = document.getElementById('valMn');
  const valCu = document.getElementById('valCu');
  const operatorAdvice = document.getElementById('operatorAdvice');

  const labMeltWeight = document.getElementById('labMeltWeight');
  const labC = document.getElementById('labC');
  const labSi = document.getElementById('labSi');
  const labMn = document.getElementById('labMn');
  const labCu = document.getElementById('labCu');

  furnaceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      furnaceBtns.forEach(b => b.classList.remove('active-furnace'));
      btn.classList.add('active-furnace');
      targetWeightInput.value = btn.dataset.capacity;
      autoSetPigIron();
      calculate();
    });
  });

  function autoSetPigIron() {
    const targetW = parseFloat(targetWeightInput.value) || 2500;
    pigIronInput.value = Math.round(targetW * 0.03);
  }

  function calculate() {
    const targetWeight = parseFloat(targetWeightInput.value) || 1;
    const swampWeight = parseFloat(swampWeightInput.value) || 0;
    
    const swampData = gradesDB[swampGradeSelect.value] || gradesDB.gjs500;
    const targetGradeData = gradesDB[targetGradeSelect.value] || gradesDB.gjs500;
    
    document.getElementById('targetCVal').innerText = targetGradeData.c.toFixed(2) + '%';
    document.getElementById('targetSiVal').innerText = targetGradeData.si.toFixed(2) + '%';
    document.getElementById('targetMnVal').innerText = targetGradeData.mn.toFixed(2) + '%';
    document.getElementById('targetCuVal').innerText = targetGradeData.cu.toFixed(2) + '%';
    
    document.getElementById('tableSwampWeight').innerText = swampWeight + ' kg';
    document.getElementById('targetWeightDisplay').innerText = targetWeight;

    let addedWeight = 0;
    let totalC_kg = swampWeight * (swampData.c / 100);
    let totalSi_kg = swampWeight * (swampData.si / 100);
    let totalMn_kg = swampWeight * (swampData.mn / 100);
    let totalCu_kg = swampWeight * (swampData.cu / 100);

    matInputs.forEach(input => {
      const weight = parseFloat(input.value) || 0;
      addedWeight += weight;
      totalC_kg += weight * (parseFloat(input.dataset.c || 0) / 100);
      totalSi_kg += weight * (parseFloat(input.dataset.si || 0) / 100);
      totalMn_kg += weight * (parseFloat(input.dataset.mn || 0) / 100);
      totalCu_kg += weight * (parseFloat(input.dataset.cu || 0) / 100);
    });

    const grandTotalWeight = swampWeight + addedWeight;
    document.getElementById('totalWeightDisplay').innerText = grandTotalWeight;
    document.getElementById('tableSwampPct').innerText = grandTotalWeight > 0 ? ((swampWeight / grandTotalWeight) * 100).toFixed(1) + '%' : '0%';
    
    matInputs.forEach((input, index) => {
      const weight = parseFloat(input.value) || 0;
      matPctDisplays[index].innerText = grandTotalWeight > 0 ? ((weight / grandTotalWeight) * 100).toFixed(1) + '%' : '0%';
    });

    if (grandTotalWeight > 0) {
      const finalC = (totalC_kg / grandTotalWeight) * 100;
      const finalSi = (totalSi_kg / grandTotalWeight) * 100;
      const finalMn = (totalMn_kg / grandTotalWeight) * 100;
      const finalCu = (totalCu_kg / grandTotalWeight) * 100;

      valC.innerText = finalC.toFixed(2) + '%';
      valSi.innerText = finalSi.toFixed(2) + '%';
      valMn.innerText = finalMn.toFixed(2) + '%';
      valCu.innerText = finalCu.toFixed(2) + '%';

      generateBigOperatorAdvice(grandTotalWeight, targetWeight, finalC, targetGradeData.c, finalSi, targetGradeData.si, finalMn, targetGradeData.mn, finalCu, targetGradeData.cu);
    }
  }

  function generateBigOperatorAdvice(totalW, targetW, c, tC, si, tSi, mn, tMn, cu, tCu) {
    let advice = [];
    const lW = parseFloat(labMeltWeight.value) || totalW;
    const lC = parseFloat(labC.value);
    const lSi = parseFloat(labSi.value);
    const lMn = parseFloat(labMn.value);
    const lCu = parseFloat(labCu.value);

    // Проверка за въведени данни от Спектрометър
    if (!isNaN(lC) || !isNaN(lSi) || !isNaN(lMn) || !isNaN(lCu)) {
      advice.push(`<span style="color: #60a5fa; font-size: 15px;">🧪 КОРЕКЦИЯ ПО СПЕКТРОМЕТЪР:</span>`);
      if (!isNaN(lC) && lC < tC) advice.push(`• Добави <span style="color: #34d399; font-size: 16px;">${((((tC - lC) / 100) * lW) / 0.98).toFixed(1)} kg</span> Науглеродител`);
      if (!isNaN(lSi) && lSi < tSi) advice.push(`• Добави <span style="color: #fbbf24; font-size: 16px;">${((((tSi - lSi) / 100) * lW) / 0.75).toFixed(1)} kg</span> FeSi75`);
      if (!isNaN(lMn) && lMn < tMn) advice.push(`• Добави <span style="color: #22d3ee; font-size: 16px;">${((((tMn - lMn) / 100) * lW) / 0.75).toFixed(1)} kg</span> FeMn75`);
      if (!isNaN(lCu) && lCu < tCu) advice.push(`• Добави <span style="color: #fb7185; font-size: 16px;">${((((tCu - lCu) / 100) * lW) / 0.99).toFixed(1)} kg</span> Мед (Cu)`);
    } else {
      // Стандартни изчисления по шихта
      const diffW = totalW - targetW;
      if (Math.abs(diffW) > 5) {
        if (diffW > 0) advice.push(`⚠️ <span style="color: #f87171;">Превишено тегло с ${diffW.toFixed(0)} kg!</span>`);
        else advice.push(`⚖️ <span style="color: #fbbf24;">Не достигат ${Math.abs(diffW).toFixed(0)} kg до целта.</span>`);
      }

      if (c < tC - 0.05) advice.push(`• Нисък C: Увеличете Науглеродителя с <span style="color: #34d399;">${(((tC - c)/100)*totalW/0.98).toFixed(1)} kg</span>`);
      if (si < tSi - 0.05) advice.push(`• Нисък Si: Увеличете FeSi с <span style="color: #fbbf24;">${(((tSi - si)/100)*totalW/0.75).toFixed(1)} kg</span>`);
      if (mn < tMn - 0.03) advice.push(`• Нисък Mn: Увеличете FeMn с <span style="color: #22d3ee;">${(((tMn - mn)/100)*totalW/0.75).toFixed(1)} kg</span>`);
      if (cu < tCu - 0.03) advice.push(`• Нисък Cu: Увеличете Cu с <span style="color: #fb7185;">${(((tCu - cu)/100)*totalW/0.99).toFixed(1)} kg</span>`);
    }

    if (advice.length === 0) {
      operatorAdvice.innerHTML = `<span style="color: #34d399; font-size: 16px;">✅ ГОТОВО ЗА ТЕНЕЦ!</span><br>Всички химически показатели съвпадат.`;
    } else {
      operatorAdvice.innerHTML = advice.join('<br>');
    }
  }

  targetWeightInput.addEventListener('input', () => { autoSetPigIron(); calculate(); });
  swampWeightInput.addEventListener('input', calculate);
  targetGradeSelect.addEventListener('change', calculate);
  swampGradeSelect.addEventListener('change', calculate);
  matInputs.forEach(i => i.addEventListener('input', calculate));
  [labMeltWeight, labC, labSi, labMn, labCu].forEach(i => i.addEventListener('input', calculate));

  autoSetPigIron();
  calculate();
});
