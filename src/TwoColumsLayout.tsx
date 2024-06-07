import React, { useState, useEffect, useCallback } from "react";
import styles from "./TwoColumnLayout.module.css";
import { Button, ThemeProvider, createTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { Subscription } from "rxjs";
import { connect } from "./connect";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { GaugeContainer, GaugeValueArc, GaugeReferenceArc, useGaugeState } from "@mui/x-charts/Gauge";

const TwoColumnLayout: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | undefined>(undefined);
  const [trainingData, setTrainingData] = useState<number[]>([]);
  const [currentValue, setCurrentValue] = useState<number | undefined>(undefined);
  const handleConnect = useCallback(() => {
    const newSubscription = connect().subscribe((value: number) => {
      setCurrentValue(value * 10);
    });
    setSubscription(newSubscription);
  }, []);
  const handleDisconnect = useCallback(() => {
    subscription?.unsubscribe();
    setSubscription(undefined);
  }, [subscription]);
  useEffect(() => {
    if (currentValue !== undefined) {
      setTrainingData((prevData) => (prevData.length >= 20 ? [...prevData.slice(1), currentValue] : [...prevData, currentValue]));
    }
  }, [currentValue]);
  useEffect(() => {
    return () => {
      subscription?.unsubscribe();
    };
  }, [subscription]);
  const newTheme = createTheme({ palette: { mode: "dark" } });
  return (
    <ThemeProvider theme={newTheme}>
      <div className={styles.layout}>
        <div className={`${styles.column} ${styles.columnLeft}`}>
          <Profile />
        </div>
        <div className={`${styles.column} ${styles.columnRight}`}>
          <div className={styles.title} style={{ marginTop: "30px", width: "100%" }}>
            Модеста мониторинг
          </div>

          <div className={styles.container}>
            <h1 className={styles.title}>Управление Bluetooth</h1>
            <div className={styles.buttons}>
              <Button variant="contained" style={{ backgroundColor: "#DCE359" }} onClick={handleConnect}>
                Подключить
              </Button>
              <Button variant="outlined" style={{ borderColor: "#DCE359", color: "#DCE359" }} onClick={handleDisconnect}>
                Отключить
              </Button>
            </div>
          </div>

          <div className={styles.title} style={{ marginTop: "30px", width: "100%" }}>
            Уровень активности
          </div>
          <ChartComponent title="Ось X" data={trainingData} />
          <ChartComponent title="Ось Y" data={trainingData} />
          <ChartComponent title="Ось Z" data={trainingData} />

          <div className={styles.container_chart}>
            <h1 className={styles.title}>Уровень заряда</h1>
            <ArcDesign />
          </div>

          <div className={styles.title} style={{ marginTop: "30px", width: "100%" }}>
            Расход комплектующих
          </div>
          <div className={styles.container_chart}>
            <h1 className={styles.title}>Подшипник</h1>
            <CompositionExample />
          </div>

          <div className={styles.container_chart}>
            <h1 className={styles.title}>Пружины</h1>
            <CompositionExample />
          </div>

          <div className={styles.container_chart}>
            <h1 className={styles.title}>Наконечник (пальцы)</h1>
            <CompositionExample />
          </div>

          <div className={styles.container_chart}>
            <h1 className={styles.title}>Нити</h1>
            <CompositionExample />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};
interface ChartComponentProps {
  title: string;
  data: number[];
}
const ChartComponent: React.FC<ChartComponentProps> = ({ title, data }) => (
  <div className={styles.container_chart}>
    <h1 className={styles.title}>{title}</h1>
    <LineChart
      margin={{
        left: 40,
        right: 10,
        top: 0,
        bottom: 20,
      }}
      series={[
        {
          data: data,
          showMark: false,
          disableHighlight: true,
          connectNulls: true,
          color: "#DCE359",
        },
      ]}
      height={200}
    />
  </div>
);
const Profile: React.FC = () => (
  <div>
    <div className={styles.person}>
      <div className={styles["person__avatar-container"]}>
        <img
          alt="Портрет члена команды"
          className={styles["person__avatar"]}
          src="https://www.womanhit.ru/media/CACHE/images/articleimage2/2019/8/margo/a6c184fd913aa69ac5ee8fbf8bea049b.jpg"
        />
      </div>
      <p className={styles["person__info"]}>
        <span itemProp="name" className={styles["person__name"]}>
          Марго Робби
        </span>
        <span className={styles["person__profession"]}>22.02.1994</span>
        <span className={styles["person__profession"]}>
          <a href="tel:+79991202332">+7 999 120 23 32</a>
        </span>
        <span className={styles["person__profession"]}>
          <a href="mailto:test@mail.ru">test@mail.ru</a>
        </span>
        <span className={styles["person__profession"]}>
          <a href="mailto:test@mail.ru">Статус: Новичок (Меньше 100 часов использования)</a>
        </span>

        <span className={styles["person__profession"]}>
          <a>Статус: Новичок (Меньше 100 часов использования)</a>
        </span>

        <span className={styles["person__profession"]}>
          <a>Идентификационный номер: XF-434</a>
        </span>
      </p>
    </div>

    <div style={{ marginTop: "30px" }}></div>
    <h2 className={styles.menu_link}>📦 Комплектация</h2>
    <h2 className={styles.menu_link}>🛠 Ремонт</h2>
    <h2 className={styles.menu_link}>🚀 Прогресс</h2>
    <h2 className={styles.menu_link}>🌟 Рейтинг</h2>
    <h2 className={styles.menu_link}>✏️ Задания</h2>
  </div>
);
const settings = {
  width: 200,
  height: 200,
  value: 87,
};
const ArcDesign: React.FC = () => (
  <Gauge
    {...settings}
    title={"Заряд"}
    cornerRadius="50%"
    sx={(theme) => ({
      [`& .${gaugeClasses.valueText}`]: {
        fontSize: 40,
      },
      [`& .${gaugeClasses.valueArc}`]: {
        fill: "#DCE359",
      },
      [`& .${gaugeClasses.referenceArc}`]: {
        fill: theme.palette.text.disabled,
      },
    })}
  />
);
export default TwoColumnLayout;

function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) {
    // No value to display
    return null;
  }

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="red" />
      <path d={`M ${cx} ${cy} L ${target.x} ${target.y}`} stroke="red" strokeWidth={3} />
    </g>
  );
}

function CompositionExample() {
  return (
    <GaugeContainer width={200} height={200} startAngle={-110} endAngle={110} value={30}>
      <GaugeReferenceArc />
      <GaugeValueArc />
      <GaugePointer />
    </GaugeContainer>
  );
}
