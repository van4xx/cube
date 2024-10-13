cube = function (id, n) {
    const refs = [];
    const cube = document.getElementById(id);
    cube.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
    cube.innerHTML = "";
    let state = [];
    const colors = ["yellow", "orange", "blue", "red", "green", "white"];
    function getFace(index) {
      const res = [];
      for (let i = 0; i < n * n; i++) {
        res.push(n * n * index + i);
      }
      return res;
    }
    function rotateFace(face, count) {
      let res = face;
      for (let i = 0; i < count; i++) {
        const agg = [];
        for (let x = 0; x < n; x++) {
          for (let y = 0; y < n; y++) {
            newX = n - y - 1;
            newY = x;
            agg.push(res[newX * n + newY]);
          }
        }
        res = agg;
      }
      return res;
    }
    function getSlice(face, index) {
      const res = [];
      for (let i = index; i < n * n; i += n) {
        res.push(face[i]);
      }
      return res;
    }
    function setSlice(face, index, slice) {
      const res = face.map((i) => i);
      for (let i = index; i < n * n; i += n) {
        res[i] = slice[Math.floor(i / n)];
      }
      return res;
    }
    const poses = {
      x: [
        ...getFace(0),
        ...getFace(1),
        ...getFace(2),
        ...getFace(3),
        ...getFace(4),
        ...getFace(5)
      ],
      y: [
        ...rotateFace(getFace(3), 3),
        ...rotateFace(getFace(0), 3),
        ...rotateFace(getFace(2), 3),
        ...rotateFace(getFace(5), 3),
        ...rotateFace(getFace(4), 1),
        ...rotateFace(getFace(1), 3)
      ],
      z: [
        ...rotateFace(getFace(0), 1),
        ...getFace(2),
        ...getFace(3),
        ...getFace(4),
        ...getFace(1),
        ...rotateFace(getFace(5), 3)
      ]
    };
    for (let i = 0; i < n * n * 6; i++) {
      const sticker = document.createElement("div");
      const color = colors[Math.floor(i / (n * n))];
      sticker.className = `sticker ${color}`;
      sticker.id = `sticker-${i}`;
      refs.push(sticker);
      state.push(color);
    }
    for (let slice = 0; slice < n; slice++) {
      const sliceEl = document.createElement("div");
      sliceEl.className = "slice";
      for (let face = 0; face < 6; face++) {
        const faceEl = document.createElement("div");
        faceEl.className = "face";
        faceEl.style.gridTemplateRows = `repeat(${n},1fr)`;
        if (face == 1 || face == 3) {
          faceEl.style.width = `${n * 100}%`;
          faceEl.style.gridTemplateColumns = `repeat(${n},1fr)`;
        }
        if (face == 3) {
          faceEl.style.transform = `rotateY(90deg) translateZ(${12 / n - 6}rem)`;
        }
        const faceStickers = getFace(face);
        const sliceStickers =
          face == 4
            ? getSlice(faceStickers, n - slice - 1)
            : getSlice(faceStickers, slice);
        const stickers =
          face == 1
            ? slice == 0
              ? faceStickers
              : []
            : face == 3
            ? slice == n - 1
              ? faceStickers
              : []
            : sliceStickers;
  
        stickers.forEach((i) => faceEl.appendChild(refs[i]));
        sliceEl.appendChild(faceEl);
      }
      cube.appendChild(sliceEl);
    }
    function setState(newState) {
      newState.forEach((color, i) => {
        refs[i].className = `sticker ${color}`;
        state[i] = color;
      });
    }
    function move(pose, slice, count) {
      cube.className = `cube ${pose}`;
      setState(poses[pose].map((i) => state[i]));
      cube.children[slice].classList.add(`rotate-start`);
      setTimeout(() => {
        cube.children[slice].classList.add(`rotate-${count}`);
        setTimeout(() => {
          let res = state;
          for (let i = 0; i < count; i++) {
            res = [
              ...setSlice(getFace(0), slice, getSlice(getFace(2), slice)),
              ...(slice == 0 ? rotateFace(getFace(1), 3) : getFace(1)),
              ...setSlice(getFace(2), slice, getSlice(getFace(5), slice)),
              ...(slice == n - 1 ? rotateFace(getFace(3), 1) : getFace(3)),
              ...rotateFace(
                setSlice(
                  rotateFace(getFace(4), 2),
                  slice,
                  getSlice(getFace(0), slice)
                ),
                2
              ),
              ...setSlice(
                getFace(5),
                slice,
                getSlice(rotateFace(getFace(4), 2), slice)
              )
            ].map((i) => res[i]);
          }
          res = poses[pose].map((i) => res[i]);
          res = poses[pose].map((i) => res[i]);
          res = poses[pose].map((i) => res[i]);
          cube.className = "cube x";
          cube.children[slice].className = "slice";
          setState(res);
        }, 700);
      }, 0);
    }
    return setInterval(() => {
      move(
        ["x", "y", "z"][Math.floor(Math.random() * 3)],
        Math.floor(Math.random() * n),
        Math.floor(Math.random() * 3) + 1
      );
    }, 800);
  };
  var interval = cube('cube', 4);
  
  document.getElementById('select')
  select.addEventListener('change',(e)=>{
    clearInterval(interval);
    interval = cube('cube', +e.target.value)
  })