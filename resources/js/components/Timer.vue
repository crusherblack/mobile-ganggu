<template>
  <div>
    <div class="btn-group btn-group-toggle" data-toggle="buttons">
      <label class="btn text-light" style="background: #4169E1">
        <input type="radio" autocomplete="off" checked />
        <i class="fas fa-clock"></i> Sisa Waktu
      </label>
      <label class="btn bg-light text-dark">
        <input type="radio" autocomplete="off" />
        {{ timeLeft }} Menit
      </label>
    </div>
    <div v-if="showModal">
      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-body">
                  <h2 class="modal-title text-center text-danger">
                    <i class="fas fa-exclamation-triangle fa-10x" style="font-size: 1.5rem;"></i> WAKTU HABIS
                  </h2>
                  <br />
                  <h1 class="text-center font-weight-bold text-dark">00.00.00</h1>
                  <p class="text-center mb-0">
                    Terima Kasih sudah mengikuti Ujian
                    <br />Silahkan klik tombol dibawah untuk mengakhiri sesi Anda
                  </p>
                </div>
                <form action="/selesaiUjian" method="post">
                  <input type="hidden" name="_token" :value="csrf_token" />
                  <input type="hidden" name="id_ujian" :value="id_ujian" />
                  <div class="modal-footer">
                    <button type="submit" class="btn btn-primary btn-block">Selesai Ujian</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  props: ["propswaktu", "id_ujian"],
  data() {
    return {
      timer: null,
      newWaktu: this.propswaktu,
      showModal: false,
      csrf_token: $('meta[name="csrf-token"]').attr("content")
    };
  },
  methods: {
    decrementOrAlert() {
      if (this.newWaktu > 0) {
        this.newWaktu--;
        return;
      }
      this.showModal = true;
      clearInterval(this.timer);
    },
    updateWaktu() {
      axios
        .put("/updateWaktu", {
          sisa_waktu: this.newWaktu,
          id: this.id_ujian
        })
        .then(response => {
          this.getSoal();
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  computed: {
    timeLeft() {
      return `${this.minutes}`;
    },
    minutes() {
      return String(Math.floor(this.newWaktu / 60)).padStart(2, "0");
    },
    seconds() {
      return String(this.newWaktu % 60).padStart(2, "0");
    }
  },
  created() {
    this.timer = setInterval(this.decrementOrAlert, 1000);
    setInterval(this.updateWaktu, 1000 * 60);
  }
};
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
</style>