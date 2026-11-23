export type LessonTermContent = {
  term: string
  pronunciation: string
  translation: string
  simpleEnglish: string
  russian: string
  examples: [string, string]
  context: [string, string]
  repetition: [string, string, string]
  question: string
  answer: string
  transition: string
}

export const dayOneIntroduction = 'Welcome to Business Learning. In this lesson, we will build a clear foundation in business through ten practical terms. For each one, you will hear the word, understand the idea, and see how it appears in everyday business. You can listen first and read along whenever that helps. Let’s begin.'

export const dayOneTerms: LessonTermContent[] = [
  {
    term:'Business', pronunciation:'BIZ-niss', translation:'бизнес, предпринимательская деятельность',
    simpleEnglish:'A business solves a problem for customers by offering a product or service. It earns money when customers choose that offer.',
    russian:'Бизнес — это организация или деятельность, которая создаёт и предлагает клиентам полезное решение. Компания должна понимать, какую задачу клиента она решает, как доставляет решение и как покрывает свои расходы. Бизнес — это вся работа компании: люди, процессы, продукт, продажи и финансы. Это понятие шире, чем бизнес-модель, которая описывает логику создания ценности и получения дохода.',
    examples:['A family bakery built its business around fresh bread, early opening hours, and friendly service.','The startup changed its business after interviews showed that customers needed simpler invoicing.'],
    context:['She runs a small business near the marina.','Good businesses listen to customers and improve over time.'],
    repetition:['A business helps customers solve a real problem.','A business brings people, products, and work together to serve customers.','A strong business creates value and can earn enough to continue.'],
    question:'What problem does this business solve for its customers?', answer:'It solves the problem described in its offer and gives customers a useful way to make progress.', transition:'Now that we have the broad idea of a business, let’s look at the people it serves.'
  },
  {
    term:'Customer', pronunciation:'KUS-tuh-mer', translation:'клиент, покупатель',
    simpleEnglish:'A customer is a person or company that buys a product or service.',
    russian:'Клиент — человек или организация, которые покупают или используют предложение компании. Понимание клиента включает не только возраст или профессию, но и его задачу, обстоятельства, критерии выбора и причины доверия. Чем точнее бизнес знает своих клиентов, тем легче ему создавать подходящий продукт, выбирать канал продаж и поддерживать долгосрочные отношения.',
    examples:['The restaurant asked its customers which lunch dishes they wanted on the menu.','A yacht maintenance company sends each customer a clear report after every inspection.'],
    context:['Our customers value quick delivery and clear updates.','The company has customers in three countries.'],
    repetition:['A customer pays for a solution.','Every customer has a reason for choosing one business over another.','When a business understands its customers, it can serve them better.'],
    question:'Why might a customer choose one company over another?', answer:'A customer may choose it because its offer better fits their needs, budget, timing, or expectations.', transition:'Once we understand the customer, we can look at what a company offers them.'
  },
  {
    term:'Product', pronunciation:'PROD-ukt', translation:'товар, продукт',
    simpleEnglish:'A product is something a business makes or sells to meet a customer need.',
    russian:'Продукт — результат работы компании, который клиент может приобрести или использовать. Это может быть физический товар, цифровой сервис, программное обеспечение или подписка. Продукт должен решать конкретную задачу клиента; его функции имеют смысл только тогда, когда помогают получить нужный результат. Компании проверяют идеи продукта на клиентах до того, как вкладывать большие средства в производство.',
    examples:['The startup tested its new product with twenty potential users before launch.','The marine shop added a compact water filter to its product range for weekend sailors.'],
    context:['The product is easy to set up and use.','They improved the product after collecting customer feedback.'],
    repetition:['A product is an offer customers can choose and use.','Companies develop products around real customer needs.','A useful product helps someone get a better result.'],
    question:'How can a company learn whether its product meets a real need?', answer:'It can speak with potential customers and test a simple version of the product with them.', transition:'Some businesses sell products. Others mainly provide useful work, which brings us to service.'
  },
  {
    term:'Service', pronunciation:'SUR-viss', translation:'услуга, сервис',
    simpleEnglish:'A service is useful work that a business does for a customer.',
    russian:'Услуга — действие, экспертная деятельность или работа, которую компания выполняет для клиента. В отличие от товара, услугу часто создают и получают в процессе взаимодействия: например, консультацию, доставку, ремонт или управление бронированием. Клиент оценивает и конечный результат, и качество общения, надёжность, сроки и поддержку. Услугу можно стандартизировать, но хороший сервис также учитывает ситуацию конкретного клиента.',
    examples:['The marina offers a winter storage service for visiting boats.','A small agency provides social media services to local restaurants.'],
    context:['The service includes setup, training, and ongoing support.','Customers expect a helpful service team when something goes wrong.'],
    repetition:['A service helps a customer through work or expertise.','Good service makes the whole customer experience easier.','A service business delivers a result through actions, not just an object.'],
    question:'What is one service a small business could offer?', answer:'It could offer delivery, repairs, consulting, cleaning, training, or another useful activity.', transition:'Products and services are different forms of an offer. The next word describes the benefit behind both.'
  },
  {
    term:'Value', pronunciation:'VAL-yoo', translation:'ценность, польза для клиента',
    simpleEnglish:'Value is the useful benefit a customer gets from a product or service.',
    russian:'Ценность — значимая для клиента польза, которую он получает от предложения. Она может заключаться в экономии времени, снижении риска, удобстве, качестве, доходе или уверенности. Цена — сумма денег, которую просят за предложение; ценность — то, насколько полезным клиент считает результат. Клиент чаще готов платить, если воспринимаемая польза оправдывает цену и превосходит доступные альтернативы.',
    examples:['The booking app creates value by helping guests avoid long phone calls.','Reliable repairs add value to a yacht by protecting its safety and resale condition.'],
    context:['Customers pay when they can see the value of an offer.','The new service offers better value for small teams.'],
    repetition:['Value is the benefit behind a purchase.','A low price is not valuable if the offer does not solve the problem.','Customers compare the value they receive with the price they pay.'],
    question:'What is the difference between price and value?', answer:'Price is the money a customer pays; value is the benefit the customer believes they receive.', transition:'To understand who may want that benefit, businesses study the market.'
  },
  {
    term:'Market', pronunciation:'MAR-kit', translation:'рынок',
    simpleEnglish:'A market is the group of customers who may want an offer, together with the other offers that compete for them.',
    russian:'Рынок — совокупность клиентов с определёнными потребностями и компаний, предлагающих способы их удовлетворить. На практике бизнес обычно выбирает конкретный сегмент: например, небольшие отели, которым нужна система бронирования, или владельцы яхт, которым важен сезонный сервис. Изучение размера рынка, привычек клиентов, конкурентов и заменителей помогает оценить спрос и выбрать позиционирование.',
    examples:['The company found a market for quiet electric tenders among small yacht owners.','The café studied the local market before choosing a location near the offices.'],
    context:['The market is changing as more customers shop online.','They sell to a niche market of independent hotels.'],
    repetition:['A market includes customers and the offers available to them.','Knowing the market helps a business make better choices.','A clear target market lets a company focus its time and money.'],
    question:'Who are the customers in a business’s target market?', answer:'They are the specific people or organizations the business wants and is able to serve.', transition:'Now let’s follow the money a business receives from those customers.'
  },
  {
    term:'Revenue', pronunciation:'REV-uh-noo', translation:'выручка, доход от продаж',
    simpleEnglish:'Revenue is all the money a business receives from selling products or services before costs are subtracted.',
    russian:'Выручка — сумма доходов от продаж за определённый период до вычета расходов. Например, если кафе продало сто обедов по десять евро, выручка от этих продаж составит тысячу евро. Выручка показывает масштаб продаж, но не означает, что вся эта сумма осталась у компании. Чтобы понять финансовый результат, необходимо отдельно учитывать затраты.',
    examples:['The café increased revenue by opening earlier on busy weekends.','The online business earns recurring revenue from monthly subscriptions.'],
    context:['Revenue grew this quarter, but costs grew faster.','The finance team tracks revenue by product line.'],
    repetition:['Revenue is money coming into the business from sales.','Revenue is counted before operating costs are taken away.','A business can have high revenue and still lose money.'],
    question:'Does revenue show how much money remains after costs?', answer:'No. Revenue is counted before costs; the remaining amount is considered when calculating profit.', transition:'That distinction matters because every business must pay costs to operate.'
  },
  {
    term:'Cost', pronunciation:'kost', translation:'затраты, расходы; стоимость',
    simpleEnglish:'A cost is money a business spends to make, sell, or deliver something.',
    russian:'Затраты — ресурсы и деньги, которые компания использует для работы. Постоянные затраты, например аренда или страхование, обычно не меняются напрямую от количества продаж. Переменные затраты, например упаковка или ингредиенты, часто растут вместе с объёмом заказов. Понимание затрат помогает устанавливать цену, планировать бюджет и видеть, какие продукты действительно приносят прибыль.',
    examples:['The restaurant reduced food costs by planning portions more carefully.','Fuel and maintenance are major costs for a marine transport company.'],
    context:['We need to know the full cost before setting the price.','Delivery costs rose after the supplier changed its rates.'],
    repetition:['Costs are what the business spends to operate.','Some costs stay similar each month, while others change with sales.','When costs rise, a company may need to improve efficiency or review prices.'],
    question:'Name one cost that a small restaurant has to manage.', answer:'It might manage rent, ingredients, staff wages, energy, or delivery costs.', transition:'When we subtract costs from revenue, we can see whether the business earned a profit.'
  },
  {
    term:'Profit', pronunciation:'PROF-it', translation:'прибыль',
    simpleEnglish:'Profit is the money left after a business subtracts its costs from its revenue.',
    russian:'Прибыль — финансовый результат, который остаётся после вычета расходов из выручки за выбранный период. Если выручка выше затрат, бизнес получил прибыль; если затраты выше — убыток. Прибыль не равна выручке и не всегда совпадает с деньгами на банковском счёте: платежи могут поступать позже, а компания — иметь долги или будущие обязательства. Устойчивая прибыль даёт возможность инвестировать, создавать резерв и развивать компанию.',
    examples:['The shop made a small profit after controlling its rent and stock costs.','The repair company reinvested part of its profit in new equipment.'],
    context:['The project was popular but did not make a profit.','Profit gives a business room to invest and prepare for risk.'],
    repetition:['Profit remains after costs are paid.','Revenue is the money from sales; profit is what remains after expenses.','A sale is useful to a business when it can deliver the offer profitably.'],
    question:'What must a business subtract from revenue to calculate profit?', answer:'It subtracts its costs and expenses for the period.', transition:'We have covered customers, offers, markets, and money. Finally, let’s connect these ideas into one system.'
  },
  {
    term:'Business Model', pronunciation:'BIZ-niss MOD-ul', translation:'бизнес-модель',
    simpleEnglish:'A business model explains how a company creates value for customers and earns money from it.',
    russian:'Бизнес-модель описывает логику работы компании: кто её клиенты, какую ценность она предлагает, как доставляет предложение и откуда получает выручку. Она также показывает ключевые затраты, ресурсы и партнёров. Бизнес-модель — не весь бизнес, а карта того, как его части связаны и могут поддерживать друг друга. Например, подписная модель получает регулярную оплату, а сервисная компания выставляет счёт за выполненную работу.',
    examples:['The software company uses a subscription business model and charges customers each month.','The tour operator earns money by connecting guests with local yacht crews and taking a booking fee.'],
    context:['They tested a new business model with a small pilot.','A clear business model shows where revenue comes from and what it costs to deliver the offer.'],
    repetition:['A business model connects customer value with revenue and costs.','It explains how a company serves its customers and earns money.','The business is the whole operation; the business model explains how that operation works economically.'],
    question:'How does this company create value and earn money?', answer:'It serves a particular customer need, delivers a useful offer, and receives revenue in a way that can cover its costs.', transition:'Let’s finish by reviewing the ten ideas you have learned today.'
  },
]

export const dayOneFinalReview = [
  'A business solves a customer problem.',
  'A customer is the person or company buying or using an offer.',
  'A product is something a business makes or sells.',
  'A service is useful work done for a customer.',
  'Value is the benefit the customer receives; price is what they pay.',
  'A market brings together customers and competing offers.',
  'Revenue is money from sales before costs are subtracted.',
  'A cost is money the business spends to operate and deliver its offer.',
  'Profit is what remains after costs are subtracted from revenue.',
  'A business model explains how a company creates value and earns money.',
]
export const dayOneClosing = 'Well done. You have completed Day 1 of Business Learning. You now know ten core terms and how they connect. Choose one business you know and try to describe its customers, offer, value, revenue, costs, and business model in English. See you in the next lesson.'
export const dayOneAudio = '/audio/day-01-business-fundamentals.wav'

export function buildDayOneNarration(): string {
  const sections = ['BUSINESS LEARNING — DAY 1: BUSINESS FUNDAMENTALS', 'Complete audio lesson narration script', '', 'INTRODUCTION', dayOneIntroduction]
  dayOneTerms.forEach((item, index) => {
    sections.push('', `TERM ${index + 1} — ${item.term}`, item.transition, `The term is ${item.term}. ${item.term}. ${item.term}.`, `Pronunciation: ${item.pronunciation}.`, `Russian translation: ${item.translation}.`, `In simple English: ${item.simpleEnglish}`, `Detailed explanation in Russian: ${item.russian}`, 'Here are two business examples.', ...item.examples, 'Now, two more sentences in context.', ...item.context, 'Listen and repeat these ideas.', ...item.repetition, 'Quick question.', item.question, '[Pause for five seconds.]', `Answer: ${item.answer}`)
  })
  sections.push('', 'FINAL REVIEW', ...dayOneFinalReview, '', 'CLOSING', dayOneClosing)
  return sections.join('\n')
}

