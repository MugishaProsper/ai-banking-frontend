import { useEffect, useState } from "react"
import { api } from "../lib/api";

const useTransfer = () => {
    const [isTransferring, setIsTransferring] = useState(false);
    const [isFetchingTransfers, setIsFetchingTransfers] = useState(false);

    const [transfers, setTransfers] = useState([])

    useEffect(() => {
        const fetchTransfers = async () => {
            setIsFetchingTransfers(true);
            try {
                const res = await api.get("/transfers");
                const transfers = res.data.transfers;
                setTransfers(transfers);
            } catch (error) {
                throw new Error(error)
            }finally{
                setIsFetchingTransfers(false)
            }
        };
        fetchTransfers()
    }, []);

    const transferAmount = async (senderAccountId, destinationAccountId, amount, note="") => {
        setIsTransferring(true);
        try {
            
        } catch (error) {
            throw new Error(error)
        } finally{
            setIsTransferring(false)
        }
    }
}