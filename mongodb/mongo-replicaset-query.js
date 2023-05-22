rs.initiate(
    {
            _id: "analysis",
            version: 1,
            members: [
                    {
                            _id: 0,
                            host: "mongodb_data_analysis1:27017",
                            priority: 3
                    },
                    {
                            _id: 1,
                            host: "mongodb_data_analysis2:27017",
                            priority: 2
                    },
                    {
                            _id: 2,
                            host: "mongodb_data_analysis3:27017",
                            priority: 1
                    }
            ]
    }
)
