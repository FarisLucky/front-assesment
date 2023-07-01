<template>
    <div>
        <Vue3Html2pdf :show-layout="true" :float-layout="true" :enable-download="true" :preview-modal="true"
            :paginate-elements-by-height="1400" filename="myPDF" :pdf-quality="2" :manual-pagination="false" pdf-format="a4"
            pdf-orientation="landscape" pdf-content-width="800px">
            <section class="pdf-content">
                <section class="report-info">
                    <section class="image-container">
                        <img class="user-image" src="https://i.imgur.com/wKblc.jpg" alt="User Image" ref="userImage" />
                    </section>

                    <section class="user-details">
                        <h4 class="user-name">Mogul Khan Touch This</h4>

                        <span class="detail-container">
                            <span class="detail-label">Game:</span>
                            Game No. 3
                        </span>

                        <span class="detail-container">
                            <span class="detail-label">Date and Time</span>
                            November 11, 2019 1:00 PM - 2:23 PM
                        </span>

                        <span class="detail-container">
                            <span class="detail-label">Game Replay Link:</span>

                            <a
                                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">https://www.youtube.com/watch?v=dQw4w9WgXcQ</a>
                        </span>
                    </section>
                </section>

                <section class="chart-container" v-for="(val, key) in 10" :key="key">
                    <h4 class="time">November 11, 2019 1:00 PM - 2:23 PM</h4>
                    {{ series }}
                </section>
            </section>
        </Vue3Html2pdf>
    </div>
</template>

<script>
import Vue3Html2pdf from 'vue3-html2pdf'

export default {
    components: {
        Vue3Html2pdf
    },
    data() {
        return {
            series: 'lorem testing makanan'
        };
    },

    mounted() {
        this.$nextTick(() => {
            setTimeout(() => {
                this.$emit("domRendered");
            }, 1000);
        });
    },
};
</script>

<style lang="scss" scoped>
.pdf-content {
    width: 100%;
    background: #fff;

    .report-info {
        display: flex;
        padding: 20px;
        padding-bottom: 0px;

        .image-container {
            width: 75px;
            height: 75px;
            border-radius: 50%;
            overflow: hidden;
            position: relative;
            margin-right: 25px;
            border: 1px solid #dadada;

            .user-image {
                height: 100%;
                min-width: 100%;
                margin-left: 50%;
                transform: translateX(-50%);
            }
        }

        .user-details {
            display: flex;
            flex-direction: column;
            flex-shrink: 0;

            .user-name {
                margin-bottom: 10px;
                flex-shrink: 0;
            }

            .detail-container {
                font-size: 13px;
                flex-shrink: 0;

                &:not(:last-child) {
                    margin-bottom: 10px;
                }

                .detail-label {
                    font-weight: 600;
                    margin-right: 5px;
                    font-size: 13px;
                }
            }
        }
    }

    .chart-container {
        width: 100%;
        height: 320px;
        padding: 20px;
        pointer-events: none;

        &:not(:last-child) {
            margin-bottom: 15px;
        }
    }
}
</style>
