'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, ExternalLink, Facebook, Building2, User, AlertTriangle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const WaveAndBirdAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const waveColors = ['#b5d3dc', '#97bfcc', '#79a7b6'];
    const waveCount = 3;

    const waves = Array(waveCount).fill(null).map((_, i) => ({
      amplitude: 30 + i * 15,
      frequency: 0.005 - i * 0.001,
      phase: 0,
      y: canvas.height * (0.5 + i * 0.15)
    }));

    const birdParticles = Array(3).fill(null).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5,
      size: 20,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    }));

    const drawWave = (wave: typeof waves[0], color: string) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x++) {
        const y = wave.y + Math.sin(x * wave.frequency + wave.phase) * wave.amplitude;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.fill();
    };

    const drawBird = (x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + size / 2, y - size / 2, x + size, y);
      ctx.quadraticCurveTo(x + size * 1.5, y - size / 2, x + size * 2, y);
      ctx.strokeStyle = '#545454';
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      waves.forEach((wave, index) => {
        wave.phase += 0.02;
        drawWave(wave, waveColors[index]);
      });

      birdParticles.forEach(bird => {
        bird.x += bird.vx;
        bird.y += bird.vy;

        if (bird.x < 0 || bird.x > canvas.width) bird.vx *= -1;
        if (bird.y < 0 || bird.y > canvas.height * 0.5) bird.vy *= -1;

        drawBird(bird.x, bird.y, bird.size);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" aria-hidden="true" />;
};

const FlipCard = ({ value, label }: { value: string; label: string }) => {
  return (
    <div className="flex flex-col items-center mx-2">
      <div className="bg-[#ffde59] text-[#545454] rounded-lg p-2 text-4xl font-bold mb-2">
        {value}
      </div>
      <div className="text-sm">{label}</div>
    </div>
  );
};

const HeroSection = ({ timeLeft }: { timeLeft: { days: number; hours: number; minutes: number; seconds: number } }) => {
  const handleScrollToRegistration = () => {
    const registrationSection = document.getElementById('registration');
    if (registrationSection) {
      registrationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-white">
      <WaveAndBirdAnimation />
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <div className="w-full max-w-[400px] mb-8 relative">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kagome_logo-lAJYOCafse7ibEINGEmouKC5gOfEIp.png"
            alt="かもめ会議 2024 ロゴ"
            width={400}
            height={300}
            priority
          />
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">COMING SOON</h2>
          <div className="flex justify-center">
            <FlipCard value={timeLeft.days.toString().padStart(2, '0')} label="DAYS" />
            <FlipCard value={timeLeft.hours.toString().padStart(2, '0')} label="HOURS" />
            <FlipCard value={timeLeft.minutes.toString().padStart(2, '0')} label="MINUTES" />
            <FlipCard value={timeLeft.seconds.toString().padStart(2, '0')} label="SECONDS" />
          </div>
        </div>
        <div className="mb-6 bg-red-600 text-white py-2 px-4 rounded-full font-semibold flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          チケットは完売いたしました
        </div>
        <button 
          onClick={handleScrollToRegistration}
          className="bg-gray-400 text-white px-8 py-3 rounded-full font-semibold cursor-not-allowed"
          disabled
        >
          参加申し込み
        </button>
      </div>
    </div>
  );
};

const FloatingHeader = () => {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('.h-screen');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        setShowLogo(heroBottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-6xl">
          <div className={`w-48 h-20 transition-opacity duration-300 ${showLogo ? 'opacity-100' : 'opacity-0'}`}>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kamome_logo_padding-VBJ3I4qnKZ8Fa7oZLYgwD1xvXWtFf8.png"
              alt="かもめ会議 2024 ロゴ"
              width={192}
              height={80}
              priority
            />
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#about" className="hover:text-[#ffde59]">ABOUT</a></li>
              <li><a href="#timetable" className="hover:text-[#ffde59]">TIME TABLE</a></li>
              <li><a href="#registration" className="hover:text-[#ffde59]">参加申し込み</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

const schedule = [
  { startTime: '9:30', endTime: '10:00', event: '受付開始', type: 'simple' },
  { startTime: '10:00', endTime: '10:15', event: 'オープニング', type: 'simple' },
  {
    startTime: '10:15',
    endTime: '11:30',
    event: '全体会',
    type: 'plenary',
    duration: '(75min.)',
    sessions: [
      {
        event: '全体会',
        title: '横浜の卒業生が語る、GLOBISや地域のつながりを活かした志の実現',
        description: '横浜にゆかりのある4名の登壇者を迎え、起業や社会活動を通じて得た体験や、その背景にある志についてお話しいただくパネルディスカッションを開催します。\n在学中に意識していたことや卒業後に感じていることなど、自己実現に向けての取り組みをお伝えします。\nネットワーキングの重要性や、コミュニティ形成の秘訣、そして予期せぬ出会いがもたらす価値についても掘り下げていきます。参加者の皆さまには、新たな視点や一歩を踏み出すためのきっかけを提供いたします。',
        speakers: [
          { 
            name: '高野 俊行氏 (GMBA2019期)', 
            organization: 'ユニクル株式会社', 
            position: 'CEO', 
            info: '',
            image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E5%85%A8%E4%BD%93%E4%BC%9A_%E9%AB%98%E9%87%8E%E3%81%95%E3%82%93-uKJhmvh7QUzX65dpUjHR55I2p9ujmL.png'
          },
          { 
            name: '大野 淳史氏 (GMBA2019期)', 
            organization: 'TOPPANホールディングス', 
            position: '事業開発本部ビジネスイノベーションセンター戦略投資部', 
            info: '',
            image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E5%85%A8%E4%BD%93%E4%BC%9A_%E5%A4%A7%E9%87%8E%E3%81%95%E3%82%93-BzXER9riCrQo5zkM5RP8sF2qPVeigV.png'
          },
          { 
            name: '古野 直毅氏 (GMBA2021期)', 
            organization: 'フィクスコンシェル株式会社', 
            position: '代表取締役', 
            info: '',
            image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E5%85%A8%E4%BD%93%E4%BC%9A_%E5%8F%A4%E9%87%8E%E3%81%95%E3%82%93-NqdsHVghFJ0ydRRjXEmratt7bs4OMJ.png'
          },
          { 
            name: '得能 淳氏 (GMBA2017期)', 
            organization: 'グロービス経営大学院大学', 
            position: '特設キャンパス責任者(横浜・仙台・水戸)', 
            info: '',
            image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E5%85%A8%E4%BD%93%E4%BC%9A_%E5%BE%97%E8%83%BD%E3%81%95%E3%82%93-f8HrUSOJeeBOazuchJinl2O9pFiCyj.png'
          }
        ]
      }
    ]
  },
  { startTime: '11:30', endTime: '13:00', event: 'ランチブレイク /\nネットワーキング', type: 'simple' },
  {
    startTime: '13:00',
    endTime: '14:00',
    event: '分科会1',
    type: 'breakout',
    duration: '(60min.)',
    sessions: [
      {
        event: '分科会A',
        title: '新規事業への挑戦\n〜対話を通して見えない枠を外してみよう〜',
        description: '思いついたアイディアを他の人に話すの恥ずかしい‥や、そんなの前例ないし‥とか、うまくいかなかったらどうしよう‥、のように、新しいことへの挑戦は自分の中に勝手に作っている見えない壁が原因であることが多いです。上手くいかないながらも聴覚障害者向けの事業を進めてきた私の事例をもとに、それだったら自分もできるかも、言われてみたら自分だけが気にしているだけかも、など、少しでも見えない壁を取り除き、一歩踏み出すきっかけを一緒に見つけられるようなセッションをご提供します。',
        speakers: [
          { 
            name: '岩田 佳子氏 (GMBA2022期)', 
            organization: '株式会社リコー', 
            position: '', 
            info: '',
            image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E6%96%B0%E8%A6%8F%E4%BA%8B%E6%A5%AD_%E5%B2%A9%E7%94%B0%E3%81%95%E3%82%93-uXFdwJ6pZEvHdz7iaUh2IFWk2PGTG4.png'
          }
        ]
      },
      {
        event: '分科会B',
        title: 'ヨコハマ未来創造会議\n～フードサーキュラーを起点に子どもの可能性を最大化するには？～',
        description: '2027年に横浜で開催される、GREEN×EXPO 2027（2027年国際園芸博覧会）を契機に、現在の大学生や企業の若手社員の若者が参加して、将来の社会についての議論、共感、自分ごとの醸成を目指す「ヨコハマ未来創造会議」が本年横浜市で立ち上がりました。\n全部で5つのプロジェクトが進行中で、その中の「フードサーキュラーを起点に子どもの可能性を最大化するには？」に取り組んでいるチームの発表を行っていただきます。キーワードは、#フードロス、＃貧困解決、＃学校給食。当日はプロジェクトの発表とともに、かもめ会議参加者と意見交換ができればと考えております。',
        speakers: [
          { name: '榎 裕子氏 (GMBA2022期)', organization: 'ヨコハマ未来創造会議 メンバー', position: '', info: '', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E3%83%A8%E3%82%B3%E3%83%8F%E3%83%9E%E6%9C%AA%E6%9D%A5%E4%BC%9A%E8%AD%B0_%E6%A6%8E%E3%81%95%E3%82%93-mQAcpSPen6tOaEiRAL8wIkWkiqZNVV.png' },
          { name: '馬場 英鷹氏 (GMBA2021期)', organization: 'ヨコハマ未来創造会議 メンバー', position: '', info: '', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E3%83%A8%E3%82%B3%E3%83%8F%E3%83%9E%E6%9C%AA%E6%9D%A5%E4%BC%9A%E8%AD%B0_%E9%A6%AC%E5%A0%B4%E3%81%95%E3%82%93-r56OjWtqO39IasrnkP0tTuxQuMUjQ0.png' }
        ]
      }
    ]
  },
  { startTime: '14:00', endTime: '14:15', event: '休憩', type: 'simple' },
  {
    startTime: '14:15',
    endTime: '15:15',
    event: '分科会2',
    type: 'breakout',
    duration: '(60min.)',
    sessions: [
      {
        event: '分科会C',
        title: '地方創生\n～鎌倉から地方創生を生み出す地域企業について～',
        description: '鎌倉市に拠点を構え、神奈川県の地方創生だけではなく、全国の地域や企業と連携し、地域活性化、移住者の促進や関係人口創出に繋がるプロジェクトを手掛ける同社。今回ご登壇いただく宮本氏は、前職の編集者から同社に転職され、現在はちいき資本主義事業部の事業部長を担っておられます。同社がこれまで手掛けたきたプロジェクトの紹介に加え、宮本氏がどのような想いを持ち、全国の地域創生を進めているのかについてもお話いただきます。',
        soldOut: true, // この行を追加
        speakers: [
          { 
            name: '宮本 早織氏', 
            organization: '面白法人カヤック', 
            position: 'ちいき資本主義事業部 事業部長', 
            info: '',
            image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E5%9C%B0%E6%96%B9%E5%89%B5%E7%94%9F%E5%AE%AE%E6%9C%AC%E3%81%95%E3%82%93-YCLUEY7KLQFkc18vnuTqBKCNhcBOtg.png'
          }
        ]
      },
      {
        event: '分科会D',
        title: 'ヘルスケア最前線！未病対策！！\n～先進的な未病産業創出を推進する神奈川県～',
        description: '神奈川県では、次世代社会システ厶「神奈川Me-BYOリビングラボ」の構築を進め、未病対策を推進しています。産官学連携で新たな価値や未病産業を創出し、持続可能な健康長寿社会の実現を目指しています。\nまた、神奈川県は全国に先駆けて神奈川発の未病産業の市場拡大を図るため、「ME-BYOサミット神奈川」を開催し、未病コンセプトやその改善の重要性を普及・啓発する活動を展開しており、未病における最新の取り組みについてもご紹介します。',
        speakers: [
          { 
            name: '成田 悠亜氏', 
            organization: '神奈川県政策局', 
            position: 'いのち・未来戦略本部 未病連携グループ 主任主事', 
            info: '',
            image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E6%9C%AA%E7%97%85%E5%AF%BE%E7%AD%96_%E6%88%90%E7%94%B0%E3%81%95%E3%82%93-ruFLmpULgm3pId3M0auwkLW2qFjZqe.png'
          }
        ]
      }
    ]
  },
  { startTime: '15:15', endTime: '15:30', event: '休憩', type: 'simple' },
  {
    startTime: '15:30',
    endTime: '16:30',
    event: '分科会3',
    type: 'breakout',
    duration: '(60min.)',
    sessions: [
      {
        event: '分科会E',
        title: '宇宙ビジネスの最前線へ\n～地上のスキルが宇宙を拓く～',
        description: '昨今注目を集める「宇宙ビジネス」、具体的にどのようなことが行われていて、どんな可能性があるのか気になる方も多いのではないでしょうか？ここ横浜・神奈川でもJAXAをはじめとするさまざまなプレイヤーが活躍しています。\n実はキャリアにおいても、高度専門領域というイメージに反して、地上産業の知見やスキルが宇宙産業で大いに求められています。\n今回は、大企業から宇宙ベンチャーに飛び込んだデザイナーが、ユニークなキャリア体験談も交えながら、その魅力についてお話しします。',
        speakers: [
          { 
            name: '山下 コウセイ氏', 
            organization: 'DigitalBlast', 
            position: '宇宙デザイナー', 
            info: '',
            image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E5%AE%87%E5%AE%99%E3%83%93%E3%82%B8%E3%83%8D%E3%82%B9_Kosei%20Yamashita-ZLo4TZ4H9hy7CUEuWEcJqzvkrKLfeV.png'
          }
        ]
      },
      {
        event: '分科会F',
        title: 'サーキュラーエコノミー\n～リーダー達の社会課題への取り組み方～',
        description: 'サーキュラーエコノミーで業界をリードする2名の代表者が、食品廃棄物を利用したリサイクル事業や、容器リユースシェアリングサービス「Megloo」について話します。各社の起業から運営までの実務経験を基に、起業のノウハウや業界の未来について伺います。社会課題に関心を持つ方にとって、次の一歩を踏み出すためのヒントに満ちた１時間です。',
        soldOut: true, // この行を追加
        speakers: [
          { name: '髙橋 巧一氏', 
            organization: '株式会社日本フードエコロジーセンター', 
            position: '代表取締役',
            info: '',
            image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E3%82%B5%E3%83%BC%E3%82%AD%E3%83%A5%E3%83%A9%E3%83%BC%E3%82%A8%E3%82%B3%E3%83%8E%E3%83%9F%E3%83%BC%E9%AB%98%E6%A9%8B%E3%81%95%E3%82%93-rwY54wj8wXhIFEmeT5nSbu4eVerNd1.png'
          },
          { 
            name: '善積 真吾氏', 
            organization: '株式会社カマン', 
            position: '代表取締役',
            info: '',
            image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E3%82%B5%E3%83%BC%E3%82%AD%E3%83%A5%E3%83%A9%E3%83%BC%E3%82%A8%E3%82%B3%E3%83%8E%E3%83%9F%E3%83%BC%E5%96%84%E7%A9%8D%E3%81%95%E3%82%93-UVwhXRCkrSGUrQ6Gc1JMw9DCWQoVTp.png'
          }
        ]
      }
    ]
  },
  { startTime: '16:30', endTime: '16:45', event: '休憩', type: 'simple' },
  { startTime: '16:45', endTime: '17:15', event: 'クロージング /\nディスカッション', type: 'simple' }
];

type Speaker = {
  name: string;
  organization: string;
  position: string;
  info: string;
  image?: string;
};

type Session = {
  event: string;
  title: string;
  description: string;
  speakers: Speaker[];
  soldOut?: boolean;
};

type EventPopupProps = {
  session: Session;
  eventType: string;
  startTime: string;
  endTime: string;
  duration?: string;
};

const EventPopup: React.FC<EventPopupProps> = ({ session, eventType, startTime, endTime, duration }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-200 transition-colors duration-200 relative h-full">
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 ${eventType === 'plenary' ? 'bg-[#ffde59] text-[#545454]' : 'bg-[#ffde59] text-[#545454]'}`}>
            {session.event}
          </span>
          {session.soldOut && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              満員御礼
            </span>
          )}
          <h3 className="text-xl font-bold mb-2 break-words whitespace-pre-line">{session.title}</h3>
          <p className="text-sm text-gray-600">{session.speakers.map(speaker => speaker.name).join(' / ')}</p>
          <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-b-[40px] border-b-[#79a7b6] rounded-br-lg"></div>
          <ExternalLink className="absolute bottom-[5px] right-[5px] w-3.5 h-3.5 text-white z-10" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[680px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="mb-4 text-[#545454]">
            <span className="text-xl font-bold">{startTime}-{endTime}</span>
            {duration && <span className="text-sm ml-2">{duration}</span>}
            <br />
            <span className="inline-block px-3 py-1 bg-[#ffde59] text-[#545454] rounded-full text-sm font-semibold mt-2">{session.event}</span>
          </div>
        </DialogHeader>
        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
          <DialogTitle className="text-xl font-bold mb-4 whitespace-pre-line">{session.title}</DialogTitle>
          {session.soldOut && (
            <p className="mb-4 text-red-500 font-bold">
              ※ こちらの分科会は満員につき締切となりました。ご了承ください。
            </p>
          )}
          <p className="mb-4 whitespace-pre-line">{session.description}</p>
          <div className="space-y-2">
            {session.speakers.map((speaker, speakerIndex) => (
              <div key={speakerIndex} className="flex items-center bg-[#79a7b6] text-white p-2 rounded-lg">
                <Image
                  src={speaker.image || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kagome_symbol_circle-nXt3WkJj062REZ1jLWrRPFtFhsiiIG.png"}
                  alt={speaker.name}
                  width={40}
                  height={40}
                  className="rounded-full mr-2"
                />
                <div>
                  <p className="font-bold text-sm">{speaker.name}</p>
                  <p className="text-xs">{speaker.organization}</p>
                  <p className="text-xs">{speaker.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function LandingPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const eventDate = new Date('2024-11-10T10:00:00')
      const difference = eventDate.getTime() - now.getTime()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#79a7b6] text-[#545454] font-sans">
      <FloatingHeader />

      <main className="pt-24">
        <HeroSection timeLeft={timeLeft} />

        <section id="about" className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold mb-8 text-center">ABOUT</h2>
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-[#79a7b6] text-center mb-6">
                参加者全員が1歩踏み出すきっかけを、ヨコハマから
              </h3>
            </div>
            <p className="text-lg mb-6">
              かもめ会議とはグロービス経営大学院の公認クラブであるグロービス横浜活性化クラブ(GYAC)が主催する、単科生・本科生・卒業生のためのビジネスカンファレンスです。
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>起業家精神の真髄に触れる：</strong> 横浜ゆかりの起業家たちが、失敗を恐れず挑戦する勇気をリアルな体験とともに伝授。</li>
              <li><strong>社会課題へのアプローチを学ぶ：</strong> 未病対策やサーキュラーエコノミーなど、今注目の分野で活躍する実務者から最前線の取り組み

を聞く。</li>
              <li><strong>未来を創る仲間と出会う：</strong> 「ヨコハマ未来創造会議」のような、次世代を担う若者たちの斬新な発想に触れ、刺激を得る。</li>
              <li><strong>意外なキャリアの可能性を発見：</strong> 宇宙ビジネスやフードテック、地方創生など、思わぬところにあなたのスキルが活きるチャンスが。</li>
            </ul>
            <p className="text-lg">
              堅苦しさは一切なし。肩の力を抜いて参加できる、でも中身は本気の1日。「自分も何かできるかも」そんな小さな思いが、大きな一歩につながる瞬間を、ぜひ体感してください。
            </p>
          </div>
        </section>

        <section id="timetable" className="py-20 bg-[#f4f4f4]">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold mb-8 text-center">TIME TABLE</h2>
            <div className="space-y-4 relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 transform -translate-x-1/2"></div>
              {schedule.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md relative z-10">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="text-xl font-bold">{item.startTime}-{item.endTime}</span>
                      {item.duration && <p className="text-sm text-gray-600">{item.duration}</p>}
                    </div>
                    <span className={`text-lg ${['全体会', '分科会1', '分科会2', '分科会3'].includes(item.event) ? 'bg-[#ff8383] text-white px-2 py-1 rounded-full' : ''}`}>
                      {item.event.split('\n').map((line, i) => (
                        <span key={i} className="block">{line}</span>
                      ))}
                    </span>
                  </div>
                  {item.type === 'plenary' || item.type === 'breakout' ? (
                    <div className={`mt-4 ${item.type === 'plenary' ? 'grid-cols-1' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}`}>
                      {item.sessions?.map((session, sessionIndex) => (
                        <div key={sessionIndex} className="mb-4 h-full">
                          <EventPopup 
                            session={session} 
                            eventType={item.type} 
                            startTime={item.startTime}
                            endTime={item.endTime}
                            duration={item.duration}
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="registration" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold mb-8 text-center">参加申し込み</h2>
        <Card className="bg-[#f4f4f4] p-6 rounded-lg shadow-md mb-8">
          <CardContent>
            <h3 className="text-xl font-bold mb-4">申し込み状況</h3>
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
              <p className="font-bold flex items-center">
                <AlertTriangle className="mr-2" />
                チケット完売のお知らせ
              </p>
              <p>多数のお申し込みをいただき、誠にありがとうございました。おかげさまで、チケットは完売いたしました。</p>
            </div>

            <h4 className="text-lg font-bold mb-2">キャンセル待ちについて</h4>
            <p className="mb-4">現在、キャンセル待ちの受付は行っておりません。ご了承ください。</p>

            <h4 className="text-lg font-bold mb-2">今後のイベント情報</h4>
            <p className="mb-4">今後のイベント情報については、公式SNSアカウントやメールマガジンにてお知らせいたします。</p>

            <h4 className="text-lg font-bold mb-2">お問い合わせ</h4>
            <p className="mb-1">かもめ会議運営事務局</p>
            <p className="mb-4">
              <a href="mailto:kamome_2024.stu@globis.ac.jp" className="text-blue-600 hover:underline">
                kamome_2024.stu@globis.ac.jp
              </a>
            </p>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
              <Button className="bg-gray-400 text-white cursor-not-allowed" disabled>
                チケット販売終了
              </Button>
              <Button className="bg-gray-400 text-white cursor-not-allowed" disabled>
                セッション申し込み終了
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

        <section className="py-20 bg-[#f4f4f4]">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold mb-8 text-center">開催概要</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Calendar className="mr-2" />
                  開催日時
                </h3>
                <p className="mb-2">2024年11月10日（日）</p>
                <p>10:00-17:15 (受付開始 09:30)</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Building2 className="mr-2" />
                  会場
                </h3>
                <p className="mb-2">グロービス経営大学院　横浜・特設キャンパス</p>
                <p>〒220-0005　神奈川県横浜市西区南幸1-1-1 JR横浜タワー14F</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <MapPin className="mr-2" />
                  アクセス
                </h3>
                <p className="mb-2">JR横浜駅 北改札口、きた西口出口を出て左／徒歩5分</p>
                <p className="mb-2">JR横浜タワー内に14Fへの直通エレベーターはございませんので、12Fで13-21F行きエレベーターまたはエスカレーターにお乗り換えいただき、14Fまでお越しください。</p>
                <a href="https://mba.globis.ac.jp/inquiry/#yokohama" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  詳細なアクセス情報はこちら
                </a>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <User className="mr-2" />
                  主催
                </h3>
                <p className="mb-2">グロービス横浜活性化クラブ(GYAC)</p>
                <a href="https://www.facebook.com/groups/gyac.yokohama" target="_blank" rel="noopener noreferrer" className="inline-block">
                  <Facebook className="w-6 h-6 text-[#545454] hover:text-[#ffde59]" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#545454] text-white py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <p>
              お問い合わせ: <a href="mailto:kamome_2024.stu@globis.ac.jp" className="hover:underline">kamome_2024.stu@globis.ac.jp</a>
            </p>
            <p className="mt-4">&copy; 2024 かもめ会議. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}