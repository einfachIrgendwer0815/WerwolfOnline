import sqlIntuitive.dbSystems
from modules import customDecorators

dbSystem = customDecorators.Singleton(sqlIntuitive.dbSystems.MySqlDbSystem)
