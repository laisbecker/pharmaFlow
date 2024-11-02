import React from 'react'
import { Text } from 'react-native'

interface FormattedDateProps {
  dateString: string;
}

const FormattedDate: React.FC<FormattedDateProps> = ({ dateString }) => {
  const formatData = (dataString: string) => {

    const date = new Date(dataString)

    const optionsDate: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }
    
    const optionsTime: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    }

    const formattedDate = date.toLocaleDateString('pt-BR', optionsDate)
    const formattedTime = date.toLocaleTimeString('pt-BR', optionsTime)
    
    return `${formattedDate} - ${formattedTime}`
  }

  return (
    <Text>- Pedido criado em {formatData(dateString)}</Text>
  )
}

export default FormattedDate
