let bankValue = 1000;
let currentBet = 0;
let wager = 5;
let lastWager = 0;
let bet = [];
let numbersBet = [];
let previousNumbers = [];

// Red numbers for 0-59
let numRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36, 37, 39, 41, 43, 45, 48, 50, 52, 54, 55, 57, 59];

// Wheel number order (60 numbers, 0-59)
let wheelnumbersAC = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26, 37, 52, 39, 44, 55, 38, 57, 40, 48, 42, 59, 46, 50, 43, 54, 41, 56, 47, 45, 53, 49, 58, 51];

let container = document.createElement('div');
container.setAttribute('id', 'container');
document.body.append(container);

startGame();

let wheel = document.getElementsByClassName('wheel')[0];
let ballTrack = document.getElementsByClassName('ballTrack')[0];

function resetGame(){
	bankValue = 1000;
	currentBet = 0;
	wager = 5;
	bet = [];
	numbersBet = [];
	previousNumbers = [];
	document.getElementById('notification').remove();
	buildBettingBoard();
}

function startGame(){
	buildWheel();
	buildBettingBoard();

	let spinBtn = document.createElement('div');
	spinBtn.setAttribute('class', 'spinBtn');
	spinBtn.innerText = 'spin';
	spinBtn.onclick = function(){
		if (!this.classList.contains('disabled')) {
			spin();
		}
	};
	container.append(spinBtn);
}

function gameOver(){
	let notification = document.createElement('div');
	notification.setAttribute('id', 'notification');
	let nSpan = document.createElement('span');
	nSpan.setAttribute('class', 'nSpan');
	nSpan.innerText = 'Bankrupt';
	notification.append(nSpan);

	let nBtn = document.createElement('div');
	nBtn.setAttribute('class', 'nBtn');
	nBtn.innerText = 'Play again';
	nBtn.onclick = function(){ resetGame(); };
	notification.append(nBtn);
	container.prepend(notification);
}

function buildWheel(){
	let wheel = document.createElement('div');
	wheel.setAttribute('class', 'wheel');

	let outerRim = document.createElement('div');
	outerRim.setAttribute('class', 'outerRim');
	wheel.style.cssText = 'display: none;';
	wheel.append(outerRim);

	let numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26, 37, 52, 39, 44, 55, 38, 57, 40, 48, 42, 59, 46, 50, 43, 54, 41, 56, 47, 45, 53, 49, 58, 51];
	let sectorAngle = 360 / 60; // 6 degrees

	for(var i = 0; i < numbers.length; i++){
		let a = i + 1;
		let spanClass = (numbers[i] < 10) ? 'single' : 'double';
		let sect = document.createElement('div');
		sect.setAttribute('id', 'sect' + a);
		sect.setAttribute('class', 'sect');
		sect.style.transform = 'rotate(' + (i * sectorAngle) + 'deg)';

		let span = document.createElement('span');
		span.setAttribute('class', spanClass);
		span.innerText = numbers[i];
		sect.append(span);

		let block = document.createElement('div');
		block.setAttribute('class', 'block');
		block.style.transform = 'rotate(' + sectorAngle + 'deg)';

		if(numbers[i] === 0){
			block.style.backgroundColor = '#016D29';
		} else if(numRed.includes(numbers[i])){
			block.style.backgroundColor = '#E0080B';
		} else {
			block.style.backgroundColor = '#000';
		}

		sect.append(block);
		wheel.append(sect);
	}

	let pocketsRim = document.createElement('div');
	pocketsRim.setAttribute('class', 'pocketsRim');
	wheel.append(pocketsRim);

	let ballTrack = document.createElement('div');
	ballTrack.setAttribute('class', 'ballTrack');
	let ball = document.createElement('div');
	ball.setAttribute('class', 'ball');
	ballTrack.append(ball);
	wheel.append(ballTrack);

	let pockets = document.createElement('div');
	pockets.setAttribute('class', 'pockets');
	wheel.append(pockets);

	let cone = document.createElement('div');
	cone.setAttribute('class', 'cone');
	wheel.append(cone);

	let turret = document.createElement('div');
	turret.setAttribute('class', 'turret');
	wheel.append(turret);

	let turretHandle = document.createElement('div');
	turretHandle.setAttribute('class', 'turretHandle');
	let thendOne = document.createElement('div');
	thendOne.setAttribute('class', 'thendOne');
	turretHandle.append(thendOne);
	let thendTwo = document.createElement('div');
	thendTwo.setAttribute('class', 'thendTwo');
	turretHandle.append(thendTwo);
	wheel.append(turretHandle);

	container.append(wheel);
}

function buildBettingBoard(){
	let bettingBoard = document.createElement('div');
	bettingBoard.setAttribute('id', 'betting_board');

	let wl = document.createElement('div');
	wl.setAttribute('class', 'winning_lines');

	// Double street bets - 18 positions (between 19 complete columns)
	var wlttb = document.createElement('div');
	wlttb.setAttribute('id', 'wlttb_top');
	wlttb.setAttribute('class', 'wlttb');
	for(var i = 0; i < 18; i++){
		let j = i;
		var ttbbetblock = document.createElement('div');
		ttbbetblock.setAttribute('class', 'ttbbetblock');
		var numA = (1 + (3 * j));
		var numB = (2 + (3 * j));
		var numC = (3 + (3 * j));
		var numD = (4 + (3 * j));
		var numE = (5 + (3 * j));
		var numF = (6 + (3 * j));
		let num = numA + ', ' + numB + ', ' + numC + ', ' + numD + ', ' + numE + ', ' + numF;
		var objType = 'double_street';
		ttbbetblock.onclick = function(){ setBet(this, num, objType, 5); };
		ttbbetblock.oncontextmenu = function(e){ e.preventDefault(); removeBet(this, num, objType, 5); };
		wlttb.append(ttbbetblock);
	}
	wl.append(wlttb);

	// Split and street bets per column
	for(var c = 1; c < 4; c++){
		let d = c;
		var wlttb2 = document.createElement('div');
		wlttb2.setAttribute('id', 'wlttb_' + c);
		wlttb2.setAttribute('class', 'wlttb');
		let maxCols = (d == 2) ? 20 : 19;
		for(var i = 0; i < maxCols; i++){
			let j = i;
			var ttbbetblock = document.createElement('div');
			ttbbetblock.setAttribute('class', 'ttbbetblock');
			ttbbetblock.onclick = function(){
				if(d == 1 || d == 2){
					var numA = ((2 - (d - 1)) + (3 * j));
					var numB = ((3 - (d - 1)) + (3 * j));
					var num = numA + ', ' + numB;
				} else {
					var numA = (1 + (3 * j));
					var numB = (2 + (3 * j));
					var numC = (3 + (3 * j));
					var num = numA + ', ' + numB + ', ' + numC;
				}
				var objType = (d == 3) ? 'street' : 'split';
				var odd = (d == 3) ? 11 : 17;
				setBet(this, num, objType, odd);
			};
			ttbbetblock.oncontextmenu = function(e){
				e.preventDefault();
				if(d == 1 || d == 2){
					var numA = ((2 - (d - 1)) + (3 * j));
					var numB = ((3 - (d - 1)) + (3 * j));
					var num = numA + ', ' + numB;
				} else {
					var numA = (1 + (3 * j));
					var numB = (2 + (3 * j));
					var numC = (3 + (3 * j));
					var num = numA + ', ' + numB + ', ' + numC;
				}
				var objType = (d == 3) ? 'street' : 'split';
				var odd = (d == 3) ? 11 : 17;
				removeBet(this, num, objType, odd);
			};
			wlttb2.append(ttbbetblock);
		}
		wl.append(wlttb2);
	}

	// Vertical split bets between columns - 18 gaps
	for(var c = 1; c < 19; c++){
		let d = c;
		var wlrtl = document.createElement('div');
		wlrtl.setAttribute('id', 'wlrtl_' + c);
		wlrtl.setAttribute('class', 'wlrtl');
		for(var i = 1; i < 4; i++){
			let j = i;
			var rtlbb = document.createElement('div');
			rtlbb.setAttribute('class', 'rtlbb' + i);
			var numA = (3 + (3 * (d - 1))) - (j - 1);
			var numB = (6 + (3 * (d - 1))) - (j - 1);
			let num = numA + ', ' + numB;
			rtlbb.onclick = function(){ setBet(this, num, 'split', 17); };
			rtlbb.oncontextmenu = function(e){ e.preventDefault(); removeBet(this, num, 'split', 17); };
			wlrtl.append(rtlbb);
		}
		wl.append(wlrtl);
	}

	// Corner bets - 2 sets of 18
	for(var c = 1; c < 3; c++){
		var wlcb = document.createElement('div');
		wlcb.setAttribute('id', 'wlcb_' + c);
		wlcb.setAttribute('class', 'wlcb');
		for(var i = 1; i < 19; i++){
			let count = (c == 1) ? i : i + 18;
			var cbbb = document.createElement('div');
			cbbb.setAttribute('id', 'cbbb_' + count);
			cbbb.setAttribute('class', 'cbbb');
			let num;
			if(count >= 1 && count < 19){
				num = (2 + ((count - 1) * 3)) + ', ' + (3 + ((count - 1) * 3)) + ', ' + (5 + ((count - 1) * 3)) + ', ' + (6 + ((count - 1) * 3));
			} else {
				num = (1 + ((count - 19) * 3)) + ', ' + (2 + ((count - 19) * 3)) + ', ' + (4 + ((count - 19) * 3)) + ', ' + (5 + ((count - 19) * 3));
			}
			var objType = 'corner_bet';
			cbbb.onclick = function(){ setBet(this, num, objType, 8); };
			cbbb.oncontextmenu = function(e){ e.preventDefault(); removeBet(this, num, objType, 8); };
			wlcb.append(cbbb);
		}
		wl.append(wlcb);
	}

	bettingBoard.append(wl);

	// Top: 1 to 30, 31 to 59
	let bbtop = document.createElement('div');
	bbtop.setAttribute('class', 'bbtop');
	let bbtopBlocks = ['1 to 30', '31 to 59'];
	for(var i = 0; i < bbtopBlocks.length; i++){
		let f = i;
		var bbtoptwo = document.createElement('div');
		bbtoptwo.setAttribute('class', 'bbtoptwo');
		let lowNums = []; for(let n = 1; n <= 30; n++) lowNums.push(n);
		let highNums = []; for(let n = 31; n <= 59; n++) highNums.push(n);
		let num = (f == 0) ? lowNums.join(', ') : highNums.join(', ');
		var objType = (f == 0) ? 'outside_low' : 'outside_high';
		bbtoptwo.onclick = function(){ setBet(this, num, objType, 1); };
		bbtoptwo.oncontextmenu = function(e){ e.preventDefault(); removeBet(this, num, objType, 1); };
		bbtoptwo.innerText = bbtopBlocks[i];
		bbtop.append(bbtoptwo);
	}
	bettingBoard.append(bbtop);

	// Number board
	let numberBoard = document.createElement('div');
	numberBoard.setAttribute('class', 'number_board');

	// Zero
	let zero = document.createElement('div');
	zero.setAttribute('class', 'number_0');
	zero.onclick = function(){ setBet(this, '0', 'zero', 35); };
	zero.oncontextmenu = function(e){ e.preventDefault(); removeBet(this, '0', 'zero', 35); };
	let nbnz = document.createElement('div');
	nbnz.setAttribute('class', 'nbn');
	nbnz.innerText = '0';
	zero.append(nbnz);
	numberBoard.append(zero);

	// Number blocks: 3 rows
	// Row 1: 3,6,...,57 (19 nums) + spacer + '2 to 1'
	// Row 2: 2,5,...,59 (20 nums) + '2 to 1'
	// Row 3: 1,4,...,58 (20 nums) + '2 to 1'
	var numberBlocks = [];
	for(var n = 3; n <= 57; n += 3) numberBlocks.push(n);
	numberBlocks.push('spacer');
	numberBlocks.push('2 to 1');
	for(var n = 2; n <= 59; n += 3) numberBlocks.push(n);
	numberBlocks.push('2 to 1');
	for(var n = 1; n <= 58; n += 3) numberBlocks.push(n);
	numberBlocks.push('2 to 1');

	var redBlocks = numRed;
	var twoToOneCount = 0;

	for(var i = 0; i < numberBlocks.length; i++){
		let a = i;

		if(numberBlocks[i] === 'spacer'){
			var spacer = document.createElement('div');
			spacer.setAttribute('class', 'number_block');
			spacer.style.visibility = 'hidden';
			numberBoard.append(spacer);
			continue;
		}

		var nbClass = (numberBlocks[i] === '2 to 1') ? 'tt1_block' : 'number_block';
		var colourClass = (redBlocks.includes(numberBlocks[i])) ? ' redNum' : ((nbClass === 'number_block') ? ' blackNum' : '');
		var numberBlock = document.createElement('div');
		numberBlock.setAttribute('class', nbClass + colourClass);

		if(numberBlocks[a] === '2 to 1'){
			twoToOneCount++;
			let currentTTI = twoToOneCount;
			numberBlock.onclick = function(){
				let col1 = []; for(let nn = 3; nn <= 57; nn += 3) col1.push(nn);
				let col2 = []; for(let nn = 2; nn <= 59; nn += 3) col2.push(nn);
				let col3 = []; for(let nn = 1; nn <= 58; nn += 3) col3.push(nn);
				let num = (currentTTI === 1) ? col1.join(', ') : ((currentTTI === 2) ? col2.join(', ') : col3.join(', '));
				setBet(this, num, 'outside_column', 2);
			};
			numberBlock.oncontextmenu = function(e){
				e.preventDefault();
				let col1 = []; for(let nn = 3; nn <= 57; nn += 3) col1.push(nn);
				let col2 = []; for(let nn = 2; nn <= 59; nn += 3) col2.push(nn);
				let col3 = []; for(let nn = 1; nn <= 58; nn += 3) col3.push(nn);
				let num = (currentTTI === 1) ? col1.join(', ') : ((currentTTI === 2) ? col2.join(', ') : col3.join(', '));
				removeBet(this, num, 'outside_column', 2);
			};
		} else {
			numberBlock.onclick = function(){
				setBet(this, '' + numberBlocks[a] + '', 'inside_whole', 35);
			};
			numberBlock.oncontextmenu = function(e){
				e.preventDefault();
				removeBet(this, '' + numberBlocks[a] + '', 'inside_whole', 35);
			};
		}

		var nbn = document.createElement('div');
		nbn.setAttribute('class', 'nbn');
		nbn.innerText = numberBlocks[i];
		numberBlock.append(nbn);
		numberBoard.append(numberBlock);
	}
	bettingBoard.append(numberBoard);

	// Dozens
	let bo3Board = document.createElement('div');
	bo3Board.setAttribute('class', 'bo3_board');
	let bo3Blocks = ['1 to 20', '21 to 40', '41 to 59'];
	for(var i = 0; i < bo3Blocks.length; i++){
		let b = i;
		var bo3Block = document.createElement('div');
		bo3Block.setAttribute('class', 'bo3_block');
		bo3Block.onclick = function(){
			let doz1 = []; for(let nn = 1; nn <= 20; nn++) doz1.push(nn);
			let doz2 = []; for(let nn = 21; nn <= 40; nn++) doz2.push(nn);
			let doz3 = []; for(let nn = 41; nn <= 59; nn++) doz3.push(nn);
			let num = (b === 0) ? doz1.join(', ') : ((b === 1) ? doz2.join(', ') : doz3.join(', '));
			setBet(this, num, 'outside_dozen', 2);
		};
		bo3Block.oncontextmenu = function(e){
			e.preventDefault();
			let doz1 = []; for(let nn = 1; nn <= 20; nn++) doz1.push(nn);
			let doz2 = []; for(let nn = 21; nn <= 40; nn++) doz2.push(nn);
			let doz3 = []; for(let nn = 41; nn <= 59; nn++) doz3.push(nn);
			let num = (b === 0) ? doz1.join(', ') : ((b === 1) ? doz2.join(', ') : doz3.join(', '));
			removeBet(this, num, 'outside_dozen', 2);
		};
		bo3Block.innerText = bo3Blocks[i];
		bo3Board.append(bo3Block);
	}
	bettingBoard.append(bo3Board);

	// EVEN / RED / BLACK / ODD
	let otoBoard = document.createElement('div');
	otoBoard.setAttribute('class', 'oto_board');
	let otoBlocks = ['EVEN', 'RED', 'BLACK', 'ODD'];
	for(var i = 0; i < otoBlocks.length; i++){
		let d = i;
		var colourClass = (otoBlocks[i] === 'RED') ? ' redNum' : ((otoBlocks[i] === 'BLACK') ? ' blackNum' : '');
		var otoBlock = document.createElement('div');
		otoBlock.setAttribute('class', 'oto_block' + colourClass);
		otoBlock.onclick = function(){
			let evenNums = []; for(let nn = 2; nn <= 58; nn += 2) evenNums.push(nn);
			let oddNums = []; for(let nn = 1; nn <= 59; nn += 2) oddNums.push(nn);
			let blackNums = []; for(let nn = 1; nn <= 59; nn++){ if(!numRed.includes(nn)) blackNums.push(nn); }
			let num;
			if(d === 0) num = evenNums.join(', ');
			else if(d === 1) num = numRed.filter(function(n){ return n > 0; }).join(', ');
			else if(d === 2) num = blackNums.join(', ');
			else num = oddNums.join(', ');
			setBet(this, num, 'outside_oerb', 1);
		};
		otoBlock.oncontextmenu = function(e){
			e.preventDefault();
			let evenNums = []; for(let nn = 2; nn <= 58; nn += 2) evenNums.push(nn);
			let oddNums = []; for(let nn = 1; nn <= 59; nn += 2) oddNums.push(nn);
			let blackNums = []; for(let nn = 1; nn <= 59; nn++){ if(!numRed.includes(nn)) blackNums.push(nn); }
			let num;
			if(d === 0) num = evenNums.join(', ');
			else if(d === 1) num = numRed.filter(function(n){ return n > 0; }).join(', ');
			else if(d === 2) num = blackNums.join(', ');
			else num = oddNums.join(', ');
			removeBet(this, num, 'outside_oerb', 1);
		};
		otoBlock.innerText = otoBlocks[i];
		otoBoard.append(otoBlock);
	}
	bettingBoard.append(otoBoard);

	// Chip deck
	let chipDeck = document.createElement('div');
	chipDeck.setAttribute('class', 'chipDeck');
	let chipValues = [1, 5, 10, 100, 'clear'];
	for(var i = 0; i < chipValues.length; i++){
		let cvi = i;
		let chipColour = (i === 0) ? 'red' : ((i === 1) ? 'blue cdChipActive' : ((i === 2) ? 'orange' : ((i === 3) ? 'gold' : 'clearBet')));
		let chip = document.createElement('div');
		chip.setAttribute('class', 'cdChip ' + chipColour);
		chip.onclick = function(){
			if(cvi !== 4){
				let cdChipActive = document.getElementsByClassName('cdChipActive');
				for(var k = 0; k < cdChipActive.length; k++){
					cdChipActive[k].classList.remove('cdChipActive');
				}
				let curClass = this.getAttribute('class');
				if(!curClass.includes('cdChipActive')){
					this.setAttribute('class', curClass + ' cdChipActive');
				}
				wager = parseInt(chip.childNodes[0].innerText);
			} else {
				bankValue = bankValue + currentBet;
				currentBet = 0;
				document.getElementById('bankSpan').innerText = '' + bankValue.toLocaleString("en-GB") + '';
				document.getElementById('betSpan').innerText = '' + currentBet.toLocaleString("en-GB") + '';
				clearBet();
				removeChips();
			}
		};
		let chipSpan = document.createElement('span');
		chipSpan.setAttribute('class', 'cdChipSpan');
		chipSpan.innerText = chipValues[i];
		chip.append(chipSpan);
		chipDeck.append(chip);
	}
	bettingBoard.append(chipDeck);

	// Bank container
	let bankContainer = document.createElement('div');
	bankContainer.setAttribute('class', 'bankContainer');

	let bank = document.createElement('div');
	bank.setAttribute('class', 'bank');
	let bankSpan = document.createElement('span');
	bankSpan.setAttribute('id', 'bankSpan');
	bankSpan.innerText = '' + bankValue.toLocaleString("en-GB") + '';
	bank.append(bankSpan);
	bankContainer.append(bank);

	let betDiv = document.createElement('div');
	betDiv.setAttribute('class', 'bet');
	let betSpan = document.createElement('span');
	betSpan.setAttribute('id', 'betSpan');
	betSpan.innerText = '' + currentBet.toLocaleString("en-GB") + '';
	betDiv.append(betSpan);
	bankContainer.append(betDiv);
	bettingBoard.append(bankContainer);

	// Previous numbers
	let pnBlock = document.createElement('div');
	pnBlock.setAttribute('class', 'pnBlock');
	let pnContent = document.createElement('div');
	pnContent.setAttribute('id', 'pnContent');
	pnContent.onwheel = function(e){
		e.preventDefault();
		pnContent.scrollLeft += e.deltaY;
	};
	pnBlock.append(pnContent);
	bettingBoard.append(pnBlock);

	container.append(bettingBoard);
}

function clearBet(){
	bet = [];
	numbersBet = [];
}

function setBet(e, n, t, o){
	lastWager = wager;
	wager = (bankValue < wager) ? bankValue : wager;
	if(wager > 0){
		if(!container.querySelector('.spinBtn')){
			let spinBtn = document.createElement('div');
			spinBtn.setAttribute('class', 'spinBtn');
			spinBtn.innerText = 'spin';
			spinBtn.onclick = function(){ spin(); };
			container.append(spinBtn);
		}
		bankValue = bankValue - wager;
		currentBet = currentBet + wager;
		document.getElementById('bankSpan').innerText = '' + bankValue.toLocaleString("en-GB") + '';
		document.getElementById('betSpan').innerText = '' + currentBet.toLocaleString("en-GB") + '';
		for(var i = 0; i < bet.length; i++){
			if(bet[i].numbers == n && bet[i].type == t){
				bet[i].amt = bet[i].amt + wager;
				let chipColour = (bet[i].amt < 5) ? 'red' : ((bet[i].amt < 10) ? 'blue' : ((bet[i].amt < 100) ? 'orange' : 'gold'));
				e.querySelector('.chip').style.cssText = '';
				e.querySelector('.chip').setAttribute('class', 'chip ' + chipColour);
				let chipSpan = e.querySelector('.chipSpan');
				chipSpan.innerText = bet[i].amt;
				return;
			}
		}
		var obj = {
			amt: wager,
			type: t,
			odds: o,
			numbers: n
		};
		bet.push(obj);

		let numArray = n.split(',').map(Number);
		for(var i = 0; i < numArray.length; i++){
			if(!numbersBet.includes(numArray[i])){
				numbersBet.push(numArray[i]);
			}
		}

		if(!e.querySelector('.chip')){
			let chipColour = (wager < 5) ? 'red' : ((wager < 10) ? 'blue' : ((wager < 100) ? 'orange' : 'gold'));
			let chip = document.createElement('div');
			chip.setAttribute('class', 'chip ' + chipColour);
			let chipSpan = document.createElement('span');
			chipSpan.setAttribute('class', 'chipSpan');
			chipSpan.innerText = wager;
			chip.append(chipSpan);
			e.append(chip);
		}
	}
}

function spin(){
	let spinBtn = document.getElementsByClassName('spinBtn')[0];
	spinBtn.style.display = 'none';

	let winNum = document.getElementsByClassName('winning_number')[0];
	if(winNum) winNum.style.display = 'none';

	document.getElementById('betting_board').style.display = 'none';
	wheel.style.cssText = '';
	var winningSpin = Math.floor(Math.random() * 60); // 0-59
	spinWheel(winningSpin);
	setTimeout(function(){
		if(numbersBet.includes(winningSpin)){
			let winValue = 0;
			let betTotal = 0;
			for(var i = 0; i < bet.length; i++){
				var numArray = bet[i].numbers.split(',').map(Number);
				if(numArray.includes(winningSpin)){
					bankValue = (bankValue + (bet[i].odds * bet[i].amt) + bet[i].amt);
					winValue = winValue + (bet[i].odds * bet[i].amt);
					betTotal = betTotal + bet[i].amt;
				}
			}
			win(winningSpin, winValue, betTotal);
		}

		currentBet = 0;
		document.getElementById('bankSpan').innerText = '' + bankValue.toLocaleString("en-GB") + '';
		document.getElementById('betSpan').innerText = '' + currentBet.toLocaleString("en-GB") + '';

		let pnClass = (numRed.includes(winningSpin)) ? 'pnRed' : ((winningSpin === 0) ? 'pnGreen' : 'pnBlack');
		let pnContent = document.getElementById('pnContent');
		let pnSpan = document.createElement('span');
		pnSpan.setAttribute('class', pnClass);
		pnSpan.innerText = winningSpin;
		pnContent.append(pnSpan);
		pnContent.scrollLeft = pnContent.scrollWidth;

		bet = [];
		numbersBet = [];
		removeChips();
		wager = lastWager;

		if(bankValue === 0 && currentBet === 0){
			gameOver();
		}

		let turret = document.getElementsByClassName('turret')[0];
		while(turret.firstChild){
			turret.removeChild(turret.firstChild);
		}

		let winNumEl = document.createElement('span');
		winNumEl.setAttribute('class', 'winning_number ' + (numRed.includes(winningSpin) ? 'win_red' : (winningSpin === 0 ? 'win_green' : 'win_black')));
		winNumEl.innerText = winningSpin;
		if(String(winningSpin).length === 1){
			winNumEl.style.padding = "70px 90px";
		} else {
			winNumEl.style.padding = "70px 70px";
		}
		winNumEl.style.display = 'block';
		turret.append(winNumEl);
	}, 10000);

	setTimeout(function(){
		wheel.style.cssText = 'display: none;';
		document.getElementById('betting_board').style.display = 'block';
		spinBtn.style.display = 'block';
	}, 11500);
}

function win(winningSpin, winValue, betTotal){
	if(winValue > 0){
		let notification = document.createElement('div');
		notification.setAttribute('id', 'notification');
		let nSpan = document.createElement('div');
		nSpan.setAttribute('class', 'nSpan');
		let nsnumber = document.createElement('span');
		nsnumber.setAttribute('class', 'nsnumber');
		nsnumber.style.cssText = (numRed.includes(winningSpin)) ? 'color:red' : 'color:black';
		nsnumber.innerText = winningSpin;
		nSpan.append(nsnumber);
		let nsTxt = document.createElement('span');
		nsTxt.innerText = ' Win';
		nSpan.append(nsTxt);
		let nsWin = document.createElement('div');
		nsWin.setAttribute('class', 'nsWin');
		let nsWinBlock = document.createElement('div');
		nsWinBlock.setAttribute('class', 'nsWinBlock');
		nsWinBlock.innerText = 'Bet: ' + betTotal;
		nSpan.append(nsWinBlock);
		nsWin.append(nsWinBlock);
		nsWinBlock = document.createElement('div');
		nsWinBlock.setAttribute('class', 'nsWinBlock');
		nsWinBlock.innerText = 'Win: ' + winValue;
		nSpan.append(nsWinBlock);
		nsWin.append(nsWinBlock);
		nsWinBlock = document.createElement('div');
		nsWinBlock.setAttribute('class', 'nsWinBlock');
		nsWinBlock.innerText = 'Payout: ' + (winValue + betTotal);
		nsWin.append(nsWinBlock);
		nSpan.append(nsWin);
		notification.append(nSpan);
		container.prepend(notification);
		setTimeout(function(){ notification.style.cssText = 'opacity:0'; }, 3000);
		setTimeout(function(){ notification.remove(); }, 4000);
	}
}

function removeBet(e, n, t, o){
	wager = (wager === 0) ? 100 : wager;
	for(var i = 0; i < bet.length; i++){
		if(bet[i].numbers == n && bet[i].type == t){
			if(bet[i].amt !== 0){
				wager = (bet[i].amt > wager) ? wager : bet[i].amt;
				bet[i].amt = bet[i].amt - wager;
				bankValue = bankValue + wager;
				currentBet = currentBet - wager;
				document.getElementById('bankSpan').innerText = '' + bankValue.toLocaleString("en-GB") + '';
				document.getElementById('betSpan').innerText = '' + currentBet.toLocaleString("en-GB") + '';
				if(bet[i].amt === 0){
					e.querySelector('.chip').style.cssText = 'display:none';
				} else {
					let chipColour = (bet[i].amt < 5) ? 'red' : ((bet[i].amt < 10) ? 'blue' : ((bet[i].amt < 100) ? 'orange' : 'gold'));
					e.querySelector('.chip').setAttribute('class', 'chip ' + chipColour);
					let chipSpan = e.querySelector('.chipSpan');
					chipSpan.innerText = bet[i].amt;
				}
			}
		}
	}
}

function spinWheel(winningSpin){
	var degree;
	for(var i = 0; i < wheelnumbersAC.length; i++){
		if(wheelnumbersAC[i] == winningSpin){
			degree = (i * 6) + 362; // 6 degrees per sector (360/60)
		}
	}
	wheel.style.cssText = 'animation: wheelRotate 5s linear infinite;';
	ballTrack.style.cssText = 'animation: ballRotate 1s linear infinite;';

	setTimeout(function(){
		ballTrack.style.cssText = 'animation: ballRotate 2s linear infinite;';
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerText = '@keyframes ballStop {from {transform: rotate(0deg);}to{transform: rotate(-' + degree + 'deg);}}';
		document.head.appendChild(style);
		window._ballStopStyle = style;
	}, 2000);
	setTimeout(function(){
		ballTrack.style.cssText = 'animation: ballStop 3s linear;';
	}, 6000);
	setTimeout(function(){
		ballTrack.style.cssText = 'transform: rotate(-' + degree + 'deg);';
	}, 9000);
	setTimeout(function(){
		wheel.style.cssText = '';
		if(window._ballStopStyle) window._ballStopStyle.remove();
	}, 10000);
}

function removeChips(){
	var chips = document.getElementsByClassName('chip');
	if(chips.length > 0){
		for(var i = 0; i < chips.length; i++){
			chips[i].remove();
		}
		removeChips();
	}
}
