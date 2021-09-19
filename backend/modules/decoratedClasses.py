import sqlIntuitive.dbSystems
import customDecorators

dbSystem = customDecorators.Singleton(sqlIntuitive.dbSystems.MySqlDbSystem)
