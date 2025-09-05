import { useState, useRef, useEffect } from 'react'

const SUGGESTIONS = [
  "How can I save more money?",
  "Explain my spending patterns",
  "Help me create a budget",
  "What are the best investment options?",
  "How to improve my credit score?",
  "Explain banking fees and charges",
  "Analyze my transaction history",
  "Set up automatic savings",
  "Compare account types",
  "Plan for retirement"
]

const MOCK_RESPONSES = {
  "How can I save more money?": "Based on your spending patterns, I can see you spend about $800/month on dining out. Consider setting a monthly budget of $400 for restaurants and putting the remaining $400 into your savings account. You could also automate transfers to make saving effortless.",
  "Explain my spending patterns": "Your spending shows a healthy pattern with 40% going to essentials (housing, utilities), 30% to discretionary spending (entertainment, dining), and 30% to savings and investments. This is a good 40/30/30 rule balance!",
  "Help me create a budget": "I'll help you create a personalized budget. Based on your income of $6,400/month, here's a suggested breakdown:\n• Housing: $1,920 (30%)\n• Transportation: $640 (10%)\n• Food: $640 (10%)\n• Utilities: $320 (5%)\n• Entertainment: $640 (10%)\n• Savings: $1,280 (20%)\n• Emergency Fund: $320 (5%)\n• Debt Payment: $640 (10%)",
  "What are the best investment options?": "Given your current savings of $32,800, here are some options:\n• High-yield savings account: 4.5% APY\n• CD ladder: 5.2% APY for 12 months\n• Index funds: Historical 7-10% annual return\n• Roth IRA: Tax-free growth potential\n\nI recommend starting with a high-yield savings account for emergency funds, then considering index funds for long-term growth.",
  "How to improve my credit score?": "Your current credit score is 720, which is good! To improve it further:\n• Keep credit utilization under 30%\n• Pay all bills on time\n• Don't close old accounts\n• Consider a credit-builder loan\n• Monitor your credit report regularly",
  "Explain banking fees and charges": "Here are the main fees to watch out for:\n• Monthly maintenance: $0 (waived with $1,500 balance)\n• ATM fees: $3 for out-of-network\n• Overdraft: $35 per occurrence\n• Wire transfer: $25 domestic, $45 international\n• Stop payment: $30\n\nYour accounts are currently fee-free due to maintaining minimum balances.",
  "Analyze my transaction history": "Based on your recent transactions, I've identified some patterns:\n• Your largest expense category is dining out ($800/month)\n• You're consistently saving $1,200/month\n• Utilities have increased 15% this quarter\n• You have 3 recurring subscriptions totaling $45/month\n\nRecommendation: Consider reviewing your dining budget and setting up alerts for unusual spending.",
  "Set up automatic savings": "Great idea! Here's how to set up automatic savings:\n• Choose your savings goal (emergency fund, vacation, etc.)\n• Set the amount ($100-500/month recommended)\n• Pick the frequency (weekly, bi-weekly, or monthly)\n• Select the source account (checking)\n• Choose the destination (savings)\n\nI can help you set this up right now. What's your savings goal?",
  "Compare account types": "Here's a comparison of our main account types:\n\n**Checking Account:**\n• No monthly fee with $1,500 balance\n• Unlimited transactions\n• Free debit card and checks\n\n**Savings Account:**\n• 4.5% APY (high yield)\n• No monthly fee\n• 6 free withdrawals/month\n\n**Credit Card:**\n• 2% cashback on all purchases\n• No annual fee\n• 0% APR for 15 months",
  "Plan for retirement": "Let's create a retirement plan! Based on your age and current savings:\n\n**Current Status:**\n• Age: 32\n• Current retirement savings: $45,000\n• Target retirement age: 65\n• Estimated need: $2.5M\n\n**Recommendations:**\n• Increase 401(k) contribution to 15% of salary\n• Open a Roth IRA with $6,000/year\n• Consider target-date funds for simplicity\n• Review plan annually and adjust as needed"
}

const QUICK_ACTIONS = [
  { icon: "💰", label: "Budget Analysis", action: "Analyze my current budget and suggest improvements" },
  { icon: "📊", label: "Spending Report", action: "Generate a detailed spending report for this month" },
  { icon: "🎯", label: "Savings Goal", action: "Help me set and track a new savings goal" },
  { icon: "📈", label: "Investment Advice", action: "Provide personalized investment recommendations" },
  //{ icon: "🔒", label: "Security Check", action: "Review my account security settings" },
  //{ icon: "💳", label: "Card Benefits", action: "Explain the benefits of my credit card" }
]

export default function AIAssistant({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI banking assistant. I can help you with financial advice, explain your spending patterns, create budgets, and answer any banking questions. How can I help you today?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content) => {
    if (!content.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)
    setShowQuickActions(false)

    // Simulate AI response delay
    setTimeout(() => {
      const response = MOCK_RESPONSES[content] || generateSmartResponse(content)

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1000)
  }

  const generateSmartResponse = (query) => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes('budget') || lowerQuery.includes('spending')) {
      return "I can help you analyze your budget and spending patterns. Would you like me to:\n• Review your current budget\n• Identify areas to cut back\n• Suggest a new budget plan\n• Track your spending goals\n\nWhat specific aspect would you like to focus on?"
    }

    if (lowerQuery.includes('invest') || lowerQuery.includes('savings')) {
      return "Great question about investments! Based on your profile, I recommend:\n• High-yield savings account for emergency funds\n• Index funds for long-term growth\n• Consider a Roth IRA for tax advantages\n\nWould you like me to explain any of these options in detail?"
    }

    if (lowerQuery.includes('credit') || lowerQuery.includes('score')) {
      return "Your credit score is currently 720, which is in the 'Good' range. To improve it:\n• Keep credit utilization under 30%\n• Pay all bills on time\n• Don't close old accounts\n• Monitor your credit report\n\nWould you like me to help you check your credit report or set up credit monitoring?"
    }

    return "I understand you're asking about '" + query + "'. While I'm designed to help with banking and financial questions, I'd recommend speaking with a financial advisor for specific investment advice. Is there something specific about your accounts or spending patterns I can help you with?"
  }

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion)
  }

  const handleQuickAction = (action) => {
    handleSendMessage(action.action)
  }

  const toggleVoiceInput = () => {
    setIsListening(!isListening)
    // In a real app, this would integrate with Web Speech API
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false)
        // Simulate voice input
        const voiceInput = "Show me my spending report for this month"
        setInputValue(voiceInput)
      }, 2000)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-t-xl shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Banking Assistant</h3>
              <p className="text-xs text-blue-100">Powered by AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className={`${ !showQuickActions ? "h-94" : "" } overflow-y-auto p-4 space-y-4`}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {showQuickActions && (
          <div className="px-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Quick Actions:</p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="flex flex-col items-center gap-1 p-2 rounded-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs"
                >
                  <span className="text-lg">{action.icon}</span>
                  <span className="text-gray-700 dark:text-gray-300 text-center leading-tight">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="px-4 pb-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue) }}>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about banking..."
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                disabled={isTyping}
              />

              {/* Voice Input Button */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                title="Voice Input"
              >
                {isListening ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
              </button>

              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>

          {/* Voice Input Status */}
          {isListening && (
            <div className="mt-2 text-center">
              <p className="text-xs text-red-500 animate-pulse">Listening... Speak now</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
