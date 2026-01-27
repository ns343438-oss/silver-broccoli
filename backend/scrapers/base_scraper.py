from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseScraper(ABC):
    @abstractmethod
    def scrape(self) -> List[Dict[str, Any]]:
        """
        Scrapes data and returns a list of dictionaries.
        Each dictionary should match the schema expected by the collector/database.
        """
        pass
