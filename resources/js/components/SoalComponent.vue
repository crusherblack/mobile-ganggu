<template>
  <div class="card">
    <div class="card-body mt-2">
      <div class="larger-smaller mb-2">
        <timer
          class="float-right"
          v-if="waktu"
          v-bind:propswaktu="waktu"
          v-bind:id_ujian="id_ujian"
        ></timer>
        <button @click="fontSize += 0.25" class="btn text-light" style="background: #4169E1">A+</button>
        <button @click="fontSize < 0.5? fontSize = 0.25: fontSize -= 0.25" class="btn btn-light">A-</button>
      </div>

      <div class="row">
        <div class="col-md-9 soal-jawaban">
          <div
            v-for="(tampilsoal, index) in soal"
            :key="index"
            :style="{ fontSize: fontSize + 'rem' }"
          >
            <div v-if="index === questionIndex" class="mb-3">
              <div class="form-group">
                <b class="nomor">Soal Nomor. {{index + 1}}</b>
                <div v-html="tampilsoal.pertanyaan" class="mt-2"></div>
                <span
                  v-if="tampilsoal.kunci_jawaban"
                  class="badge badge-primary"
                >Kunci Jawaban: {{tampilsoal.kunci_jawaban | keatas}}</span>
              </div>
              <div class="example ex1" v-if="tampilsoal.tipe === 1 || tampilsoal.tipe === 3">
                <div class="multiple-choice">
                  <tr>
                    <td>
                      <label class="radio blue">
                        <input
                          type="radio"
                          v-model="picked[index]"
                          @change="updateJawaban"
                          :value="{id:tampilsoal.id, jawaban:'a',nomor:tampilsoal.nomor}"
                        />
                        <span>A</span>
                      </label>
                    </td>
                    <td>
                      <div v-html="tampilsoal.opsi_A"></div>
                    </td>
                  </tr>
                </div>
                <div class="multiple-choice">
                  <tr>
                    <td>
                      <label class="radio blue">
                        <input
                          type="radio"
                          v-model="picked[index]"
                          @change="updateJawaban"
                          :value="{id:tampilsoal.id, jawaban:'b',nomor:tampilsoal.nomor}"
                        />
                        <span>B</span>
                      </label>
                    </td>
                    <td>
                      <div v-html="tampilsoal.opsi_B"></div>
                    </td>
                  </tr>
                </div>
                <div class="multiple-choice">
                  <tr>
                    <td>
                      <label class="radio blue">
                        <input
                          type="radio"
                          v-model="picked[index]"
                          @change="updateJawaban"
                          :value="{id:tampilsoal.id, jawaban:'c',nomor:tampilsoal.nomor}"
                        />
                        <span>C</span>
                      </label>
                    </td>
                    <td>
                      <div v-html="tampilsoal.opsi_C"></div>
                    </td>
                  </tr>
                </div>
                <div class="multiple-choice">
                  <tr>
                    <td>
                      <label class="radio blue">
                        <input
                          type="radio"
                          v-model="picked[index]"
                          @change="updateJawaban"
                          :value="{id:tampilsoal.id, jawaban:'d',nomor:tampilsoal.nomor}"
                        />
                        <span>D</span>
                      </label>
                    </td>
                    <td>
                      <div v-html="tampilsoal.opsi_D"></div>
                    </td>
                  </tr>
                </div>
                <div class="multiple-choice" v-if="tampilsoal.opsi_E !== null">
                  <tr>
                    <td>
                      <label class="radio blue">
                        <input
                          type="radio"
                          v-model="picked[index]"
                          @change="updateJawaban"
                          :value="{id:tampilsoal.id, jawaban:'e',nomor:tampilsoal.nomor}"
                        />
                        <span>E</span>
                      </label>
                    </td>
                    <td>
                      <div v-html="tampilsoal.opsi_E"></div>
                    </td>
                  </tr>
                </div>
              </div>
              <div class="essay mb-2" v-if="tampilsoal.tipe === 2">
                <textarea
                  class="form-control"
                  @mouseleave="updateEssay"
                  v-model="essay[tampilsoal.id]"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 text-center text-md-right p-2">
          <button
            v-for="(boxkanan, index) in soal"
            :key="index"
            type="button"
            class="btn text-primary box-kanan"
            :class="{'btn-warning text-light' : boxkanan.ragu_ragu || boxkanan.ragu_ragu && boxkanan.jawaban, 'btn-primary text-light': questionIndex === index,'btn-info text-light': boxkanan.jawaban && boxkanan.ragu_ragu === 0,'btn-outline-primary': boxkanan.jawaban === null}"
            @click="changeIndex(index)"
          >
            {{index + 1}}
            <a v-if="boxkanan.tipe === 1 || boxkanan.tipe === 3">{{boxkanan.jawaban}}</a>
          </button>
        </div>
      </div>
    </div>
    <div class="card-footer text-muted">
      <div class="row">
        <div class="col-sm-4 text-center text-md-left">
          <button
            class="btn btn-primary btn-sm btn-bawah"
            :disabled="questionIndex === 0"
            v-on:click="prev"
          >
            Sebelumnya
            <i class="fas fa-angle-double-left"></i>
          </button>
        </div>
        <div class="col-sm-4 text-center">
          <a v-for="(buttonbawah, index) in soal" :key="index">
            <button
              v-if="index === questionIndex"
              class="btn btn-sm btn-bawah"
              :class="{'btn-warning btn-ragu': buttonbawah.ragu_ragu === 0,'btn-warning': buttonbawah.ragu_ragu === 1 }"
              @click="updateRagu2(buttonbawah.id)"
            >
              <i class="fas fa-check"></i> Ragu-ragu
            </button>
          </a>
        </div>
        <div class="col-sm-4 text-center text-md-right">
          <button
            class="btn btn-info btn-sm btn-bawah"
            v-on:click="next"
            v-if="questionIndex <= (soal.length - 2 )"
          >
            <i class="fas fa-angle-double-right"></i> Berikutnya
          </button>
          <button
            class="btn btn-success btn-sm btn-bawah"
            v-if="questionIndex === (soal.length - 1 )"
          >
            <i class="fas fa-flag-checkered"></i> Selesai
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import timer from "./Timer";
import axiosRetry from "axios-retry";
axiosRetry(axios, {
  retries: 5
});
export default {
  components: {
    timer
  },
  name: "soal-template",
  data() {
    return {
      soal: [],
      picked: [],
      essay: [],
      tampilhasil: false,
      hasil: [],
      questionIndex: 0,
      fontSize: 1,
      waktu: 0,
      id_ujian: 0
    };
  },
  mounted() {
    this.getSoal();
  },
  methods: {
    getSoal() {
      axios
        .get("/getdata")
        .then(response => {
          this.soal = response.data.soal;
          this.picked = response.data.jawaban;
          this.essay = response.data.essay;
          this.waktu = response.data.waktu["sisa_waktu"];
          this.id_ujian = response.data.waktu["id"];
        })
        .catch(error => {
          console.log(error);
        });
    },
    submitJawaban() {},
    updateJawaban() {
      axios
        .put("/updateJawaban", {
          jawaban: this.picked
        })
        .then(response => {
          this.getSoal();
        })
        .catch(error => {
          console.log(error);
        });
    },
    updateEssay() {
      axios
        .put("/updateEssay", {
          jawaban: this.essay
        })
        .then(response => {
          this.getSoal();
        })
        .catch(error => {
          console.log(error);
        });
    },
    updateRagu2(id) {
      axios
        .put("/updateRagu", {
          id: id
        })
        .then(response => {
          this.getSoal();
        })
        .catch(error => {
          console.log(error);
        });
    },
    next: function() {
      this.questionIndex++;
      window.scrollTo(0, 0);
    },
    // Go to previous question
    prev: function() {
      this.questionIndex--;
      window.scrollTo(0, 0);
    },
    changeIndex: function(index) {
      this.questionIndex = index;
      window.scrollTo(0, 0);
    }
  },
  filters: {
    keatas(val) {
      return val.toUpperCase();
    }
  }
};
</script>

<style  lang="scss" scoped>
.card {
  min-height: 90vh;
  overflow: hidden;
}

.box-kanan {
  width: 3rem;
  height: 3rem;
  margin-right: 4.1px;
  margin-bottom: 4.1px;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  border: 2px solid #2375f1;
}

.btn-bawah {
  width: 17vh;
  height: 4.5vh;
  margin-right: 2px;
  margin-bottom: 2px;
  cursor: pointer;

  font-family: Georgia, "Times New Roman", Times, serif;
  padding: 0;
}

.soal-jawaban {
  font-size: 1rem;
  font-family: Georgia, "Times New Roman", Times, serif;
  color: #0e0c0c;
}

.nomor {
  font-size: 20px;
  font-family: Georgia, "Times New Roman", Times, serif;
}

.example {
  margin: 20px;
}
.example input {
  display: none;
}
.example label {
  margin-right: 20px;
  display: inline-block;
  cursor: pointer;
}

.ex1 span {
  display: block;
  padding: 5px 10px 5px 25px;
  border: 2px solid #ddd;
  border-radius: 5px;
  position: relative;
  transition: all 0.25s linear;
}
.ex1 span:before {
  content: "";
  position: absolute;
  left: 5px;
  top: 50%;
  -webkit-transform: translatey(-50%);
  transform: translatey(-50%);
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #ddd;
  transition: all 0.25s linear;
}
.ex1 input:checked + span {
  background-color: #fff;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);
}
.ex1 .blue input:checked + span {
  color: #3490dc;
  border-color: #3490dc;
}
.ex1 .blue input:checked + span:before {
  background-color: #3490dc;
}
.ragu2 {
  margin-left: 35%;
}

.btn-ragu {
  background: #2375f1;
  color: #fff;
  border-color: #2375f1;
}
</style>