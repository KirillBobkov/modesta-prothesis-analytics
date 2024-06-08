import React, { useState, useEffect, useCallback } from "react";
import styles from "./TwoColumnLayout.module.css";
import { Button, ThemeProvider, createTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { Subscription } from "rxjs";
import { connect, disconnect, getStatus, read } from "./connect";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from "@mui/x-charts/Gauge";

import { fromEvent, interval } from "rxjs";
import { mapTo, scan, startWith, tap } from "rxjs/operators";

const INITIAL_COUNT = 0;

// Функция для создания Observable счётчика
export function createCounterObservable() {
  // Создаём поток интервалов, который будет увеличивать значение счётчика каждую секунду
  const counter$ = interval(1000).pipe(
    // Используем scan для накопления значений
    scan((acc, _) => acc + 1),
    // Начинаем с начального значения
    startWith(INITIAL_COUNT)
  );

  return counter$;
}

function formatSeconds(seconds: number) {
  const hours = Math.floor(seconds / 3600); // Часы
  seconds %= 3600; // Остаток от деления на 3600 (минуты)

  const minutes = Math.floor(seconds / 60); // Минуты
  seconds %= 60; // Секунды

  return `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}:${(
    "0" + seconds
  ).slice(-2)}`;
}

const TwoColumnLayout: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | undefined>(
    undefined
  );
  const [subscription2, setSubscription2] = useState<Subscription | undefined>(
    undefined
  );
  const [subscription3, setSubscription3] = useState<Subscription | undefined>(
    undefined
  );

  const [trainingData, setTrainingData] = useState<any[]>([]);
  const [currentValue, setCurrentValue] = useState<any[] | undefined>(
    undefined
  );
  const [timeStart, setSeconds] = useState<number | undefined>(undefined);

  const [connected, setStatus] = useState<boolean>(false);

  const handleConnect = useCallback(() => {
    //
    const newSubscription = connect().subscribe((value: any) => {
      const parsed = value.split(",");
      if (Array.isArray(parsed)) {
        setCurrentValue(parsed);
      }
    });
    setSubscription(newSubscription);

    // Пример использования
    const counterObj = createCounterObservable();

    const newSubscription2 = counterObj.subscribe({
      next: (value) => setSeconds(value),
    });

    setSubscription2(newSubscription2);
  }, []);

  const handleDisconnect = useCallback(() => {
    disconnect();

    subscription?.unsubscribe();
    setSubscription(undefined);
    subscription2?.unsubscribe();
    setSubscription2(undefined);
    setSeconds(undefined);

  }, [subscription]);
  useEffect(() => {
    if (currentValue !== undefined) {
      setTrainingData((prevData) =>
        prevData.length >= 20
          ? [...prevData.slice(1), currentValue]
          : [...prevData, currentValue]
      );
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
          <div className={styles.title} style={{ width: "100%" }}>
            Модеста мониторинг
          </div>
          <div style={{ marginTop: "30px" }}></div>
          <div className={styles.container_buttons}>
            <h1 className={styles.secondary_title}>Управление Bluetooth</h1>
            <div className={styles.buttons}>
              <Button
                variant="contained"
                style={{ backgroundColor: "#DCE359" }}
                onClick={handleConnect}
              >
                Подключить
              </Button>
              <Button
                variant="outlined"
                style={{ borderColor: "#DCE359", color: "#DCE359" }}
                onClick={handleDisconnect}
              >
                Отключить
              </Button>
           
            </div>

          </div>
          <div style={{ marginTop: "30px" }}></div>
          <h1 className={styles.title}>{!!getStatus() ? 'Подключено' : "Отключено"}</h1>
          <div style={{ marginTop: "30px" }}></div>
          <h2 className={styles.menu_link}>📦 Комплектация</h2>
          <h2 className={styles.menu_link}>🛠 Ремонт</h2>
          <h2 className={styles.menu_link}>🚀 Прогресс</h2>
          <h2 className={styles.menu_link}>🌟 Рейтинг</h2>
          <h2 className={styles.menu_link}>✏️ Задания</h2>
        </div>
        <div className={`${styles.column} ${styles.columnCenter}`}>
          <div className={styles.title} style={{ width: "100%" }}>
            Уровень активности
          </div>

          <div className={styles.charts}>
            <ChartComponent
              title="Ось X"
              data={trainingData.map((tr) => tr[0])}
            />
            <ChartComponent
              title="Ось Y"
              data={trainingData.map((tr) => tr[1])}
            />
            <ChartComponent
              title="Ось Z"
              data={trainingData.map((tr) => tr[2])}
            />

            <div className={styles.container_chart_part}>
              <h1 className={styles.secondary_title}>Заряд, %</h1>
              <ArcDesign />
            </div>

            <div className={styles.container_chart_part}>
              <h1 className={styles.secondary_title}>
                Общее время использования
              </h1>
              <h1 className={styles.title}>{formatSeconds(timeStart ?? 0)}</h1>
            </div>
          </div>

          <div
            className={styles.title}
            style={{ marginTop: "30px", width: "100%" }}
          >
            Расход комплектующих
          </div>
          <div className={styles.charts_2}>
            <div className={styles.container_chart_2}>
              <h1 className={styles.secondary_title}>Втулки</h1>
              <CompositionExample val={30} />
            </div>

            <div className={styles.container_chart_2}>
              <h1 className={styles.secondary_title}>Пружины</h1>
              <CompositionExample val={66} />
            </div>

            <div className={styles.container_chart_2}>
              <h1 className={styles.secondary_title}>Наконечник</h1>
              <CompositionExample val={21} />
            </div>

            <div className={styles.container_chart_2}>
              <h1 className={styles.secondary_title}>Нити</h1>
              <CompositionExample val={89} />
            </div>
          </div>
        </div>
        <div className={`${styles.column} ${styles.columnLeft}`}>
          <Profile />
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
    <h1 className={styles.secondary_title}>{title}</h1>
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
        <p itemProp="name" className={styles["person__name"]}>
          Марго Робби
        </p>
      </div>
    </div>

    <table>
      <tr>
        <td>Дата рождения</td>
        <td className={styles["person__profession"]}>22.02.1994</td>
      </tr>
      <tr>
        <td>Телефон</td>
        <td>
          <p className={styles["person__profession"]}>
            <a href="tel:+79991202332">+7 999 120 23 32</a>
          </p>
        </td>
      </tr>
      <tr>
        <td>E-mail</td>
        <td>
          <p className={styles["person__profession"]}>
            <a href="mailto:test@mail.ru">test@mail.ru</a>
          </p>
        </td>
      </tr>
      <tr>
        <td>Статус</td>
        <td>
          <p className={styles["person__profession"]}>
            <a>Новичок (Меньше 100 часов использования)</a>
          </p>
        </td>
      </tr>
      <tr>
        <td>Идентификатор</td>
        <td>
          <p className={styles["person__profession"]}>
            <a>XF-434</a>
          </p>
        </td>
      </tr>
    </table>
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
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke="red"
        strokeWidth={3}
      />
    </g>
  );
}

function CompositionExample({ val }: any) {
  return (
    <Gauge
  value={val}
  startAngle={-110}
  endAngle={110}
  sx={{
    [`& .${gaugeClasses.valueText}`]: {
      fontSize: 30,
      transform: 'translate(0px, 0px)',
    },
    [`& .${gaugeClasses.valueArc}`]: {
      fill: "#DCE359",
    },
  }}
  text={
     ({ value, valueMax }) => `${value}%`
  }
/>
  );
}
