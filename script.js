document.addEventListener('DOMContentLoaded', () => {
  const gradesDB = {
    gjs500: { name: 'EN-GJS-500-7', c: 3.60, si: 2.50 },
    gjl200: { name: 'EN-GJL-200',     c: 3.30, si: 2.10 },
    gjs400: { name: 'EN-GJS-400-15',  c: 3.70, si: 2.60 }
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
  const barC = document.getElementById('barC');
  const barSi = document.getElementById('barSi');
  const advisorText = document.getElementById('advisorText');

  const calcBtn = document.getElementById('calcBtn');
  const optimizeBtn = document.getElementById('optimizeBtn');

  furnaceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      furnaceBtns.forEach(b => b.classList.remove('active-furnace'));
      btn.classList.add('active-furnace');
      targetWeightInput.value = btn.dataset.capacity;
      calculate();
    });
  });

  function calculate() {
    const targetWeight = parseFloat(targetWeightInput.value) || 1;
    const swampWeight = parseFloat(swampWeightInput.value) || 0;
    
    const swampData = gradesDB[swampGradeSelect.value] || { c: 3.60, si: 2.50 };
    const targetGradeData = gradesDB[targetGradeSelect.value] || { c: 3.60, si: 2.50 };
    
    document.getElementById('targetCVal').innerText = targetGradeData.c.toFixed(2) + '%';
    document.getElementById('targetSiVal').innerText = targetGradeData.si.toFixed(2) + '%';
    document.getElementById('tableSwampWeight').innerText = swampWeight + ' kg';
    document.getElementById('targetWeightDisplay').innerText = targetWeight;

    let addedWeight = 0;
    let totalC_kg = swampWeight * (swampData.c / 100);
    let totalSi_kg = swampWeight * (swampData.si / 100);

    matInputs.forEach(input => {
      const weight = parseFloat(input.value) || 0;
      addedWeight += weight;
      totalC_kg += weight * (parseFloat(input.dataset.c || 0) / 100);
      totalSi_kg += weight * (parseFloat(input.dataset.si || 0) / 100);
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

      valC.innerText = finalC.toFixed(2) + '%';
      valSi.innerText = finalSi.toFixed(2) + '%';

      barC.style.width = Math.min((finalC / 4.2) * 100, 100) + '%';
      barSi.style.width = Math.min((finalSi / 3.2) * 100, 100) + '%';

      // Генератор на интелигентен съвет
      generateAdvisorAdvice(grandTotalWeight, targetWeight, finalC, targetGradeData.c, finalSi, targetGradeData.si);
    }
  }

  // Логика на съветника
  function generateAdvisorAdvice(totalW, targetW, currentC, targetC, currentSi, targetSi) {
    let advice = [];
    
    // Проверка за обем
    const diffW = totalW - targetW;
    if (Math.abs(diffW) > 5) {
      if (diffW > 0) advice.push(`⚠️ Превишавате целта с <strong>${diffW.toFixed(0)} kg</strong>.`);
      else advice.push(`⚖️ Не достигате <strong>${Math.abs(diffW).toFixed(0)} kg</strong> до пълна пещ.`);
    }

    // Проверка за Въглерод (C)
    const diffC = currentC - targetC;
    if (Math.abs(diffC) > 0.1) {
      if (diffC < 0) advice.push(`🔹 Въглеродът е нисък. Добавете <strong>${Math.abs((diffC * totalW) / 98).toFixed(1)} kg</strong> Навъглеродител.`);
      else advice.push(`🔴 Въглеродът е висок! Намалете навъглеродителя или увеличете скрапа.`);
    }

    // Проверка за Силиций (Si)
    const diffSi = currentSi - targetSi;
    if (Math.abs(diffSi) > 0.1) {
      if (diffSi < 0) advice.push(`🔹 Силицият е нисък. Добавете <strong>${Math.abs((diffSi * totalW) / 75).toFixed(1)} kg</strong> FeSi75.`);
      else advice.push(`🔴 Силицият е висок! Намалете FeSi.`);
    }

    if (advice.length === 0) {
      advisorText.innerHTML = "✅ <strong>Перфектна шихта!</strong> Химията и теглото съвпадат точно с целевата марка.";
    } else {
      advisorText.innerHTML = advice.join("<br>");
    }
  }

  calcBtn.addEventListener('click', calculate);

  optimizeBtn.addEventListener('click', () => {
    pigIronInput.value = Math.round(parseFloat(targetWeightInput.value) * 0.03); 
    calculate();
  });

  targetWeightInput.addEventListener('input', calculate);
  swampWeightInput.addEventListener('input', calculate);
  targetGradeSelect.addEventListener('change', calculate);
  swampGradeSelect.addEventListener('change', calculate);
  matInputs.forEach(i => i.addEventListener('input', calculate));

  calculate();
});
